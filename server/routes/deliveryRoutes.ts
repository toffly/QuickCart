import express from "express";
import {
  cancelDelivery,
  completeDelivery,
  getDeliveryDetail,
  getMyDeliveries,
  loginPartner,
  updateDeliveryStatus,
  updateLocation,
} from "../controller/deliveryController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/login", loginPartner);
deliveryRouter.get("/my-deliveries", deliveryAuth, getMyDeliveries);
deliveryRouter.get("/my-deliveries/:id", deliveryAuth, getDeliveryDetail);
deliveryRouter.put(
  "/my-deliveries/:id/complete",
  deliveryAuth,
  completeDelivery,
);
deliveryRouter.put("/my-deliveries/:id/cancel", deliveryAuth, cancelDelivery);
deliveryRouter.put(
  "/my-deliveries/:id/status",
  deliveryAuth,
  updateDeliveryStatus,
);
deliveryRouter.put("/my-deliveries/:id/location", deliveryAuth, updateLocation);

export default deliveryRouter;
