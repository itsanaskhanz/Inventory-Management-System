import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "./order.controller.js";

const router = Router();

router.get("/", authenticate, getOrders);
router.post("/", authenticate, createOrder);
router.get("/:id", authenticate, getOrderById);

export default router;