// POST

import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

class StockReservationError extends Error {}

const MAX_STATUS_UPDATE_ATTEMPTS = 5;

// /api/orders
export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const quantitiesByProduct = new Map<string, number>();
  for (const item of items) {
    if (
      typeof item?.product !== "string" ||
      item.product.trim().length === 0
    ) {
      return res.status(400).json({ message: "Invalid product" });
    }

    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Item quantity must be a positive integer" });
    }

    const productId = item.product.trim();
    const quantity = (quantitiesByProduct.get(productId) ?? 0) + item.quantity;
    if (!Number.isSafeInteger(quantity)) {
      return res
        .status(400)
        .json({ message: "Item quantity must be a positive integer" });
    }
    quantitiesByProduct.set(productId, quantity);
  }

  const aggregatedItems = [...quantitiesByProduct.entries()]
    .map(([product, quantity]) => ({ product, quantity }))
    .sort((a, b) => a.product.localeCompare(b.product));

  let order;
  try {
    order = await prisma.$transaction(async (transaction) => {
      const products = await transaction.product.findMany({
        where: { id: { in: aggregatedItems.map((item) => item.product) } },
      });
      const productMap = new Map(products.map((product) => [product.id, product]));

      const orderItems = aggregatedItems.map((item) => {
        const dbProduct = productMap.get(item.product);
        if (!dbProduct) throw new StockReservationError();

        return {
          product: dbProduct.id,
          name: dbProduct.name,
          image: dbProduct.image,
          price: dbProduct.price,
          quantity: item.quantity,
          unit: dbProduct.unit,
        };
      });

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const deliveryFee = subtotal > 20 ? 0 : 1.99;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

      for (const item of aggregatedItems) {
        const reservation = await transaction.product.updateMany({
          where: { id: item.product, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (reservation.count !== 1) throw new StockReservationError();
      }

      return transaction.order.create({
        data: {
          userId: req.user!.id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          subtotal,
          deliveryFee,
          tax,
          total,
          statusHistory: [
            {
              status: "Placed",
              note: "Order placed successfully",
              timestamp: new Date(),
            },
          ],
        },
      });
    });
  } catch (error) {
    if (error instanceof StockReservationError) {
      return res.status(404).json({ message: "Product out of stock" });
    }
    throw error;
  }

  if (paymentMethod === "cart") {
    //stripe payment link
  }

  res.json({ order });
};

// GET
// /api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;

  const where: any = {
    userId: req.user!.id,
    NOT: [{ paymentMethod: "card", isPaid: false }],
  };

  if (status && status !== "all") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    include: { deliveryPartner: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

// GET
// /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id as string,
      userId: req.user!.id,
    },
    include: {
      deliveryPartner: {
        select: { name: true, phone: true, avatar: true, vehicleType: true },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ order });
};

// PUT
// /api/orders/:id
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;
  if (typeof status !== "string" || status.trim().length === 0) {
    return res.status(400).json({ message: "Status must be a non-empty string" });
  }

  const nextStatus = status.trim();
  const historyEntry = {
    status: nextStatus,
    note: note || `Order ${nextStatus.toLowerCase()}`,
    timestamp: new Date(),
  };

  for (let attempt = 0; attempt < MAX_STATUS_UPDATE_ATTEMPTS; attempt += 1) {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const history = Array.isArray(order.statusHistory)
      ? order.statusHistory
      : [];
    const update = await prisma.order.updateMany({
      where: {
        id: order.id,
        updatedAt: order.updatedAt,
        statusHistory: { equals: history },
      },
      data: {
        status: nextStatus,
        statusHistory: [...history, historyEntry],
      },
    });

    if (update.count === 1) {
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
      });
      return res.json({ order: updatedOrder });
    }
  }

  return res.status(409).json({
    message: "Order status changed concurrently; please retry",
  });
};

// GET
// /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: {
      NOT: [
        {
          paymentMethod: "card",
          isPaid: false,
        },
      ],
    },
    include: {
      user: { select: { name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

// GET
// /api/orders/:id/location
export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    select: { liveLocation: true, status: true },
  });

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ liveLocation: order.liveLocation, status: order.status });
};
