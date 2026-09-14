import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  assignDeliveryPartner,
  createDeliveryPartner,
  getAdminStats,
  getDeliveryPartners,
  updateDeliveryPartner,
} from "../controller/adminController.js";

const adminRotuer = express.Router();

adminRotuer.get("/stats", auth, admin, getAdminStats);
adminRotuer.get("/delivery-partners", auth, admin, getDeliveryPartners);
adminRotuer.post("/delivery-partners", auth, admin, createDeliveryPartner);
adminRotuer.put("/delivery-partners/:id", auth, admin, updateDeliveryPartner);
adminRotuer.put("/orders/:id/assign", auth, admin, assignDeliveryPartner);

export default adminRotuer;
