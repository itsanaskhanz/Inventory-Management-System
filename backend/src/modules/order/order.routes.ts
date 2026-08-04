import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getOrders,
  searchOrders,
  updateOrder,
} from "./order.controller.js";

const router = Router();

router.get("/", authenticate, getOrders);
router.post("/", authenticate, createOrder);
router.get("/search", authenticate, searchOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id", authenticate, updateOrder);

export default router;
