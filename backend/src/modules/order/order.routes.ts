import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  createOrderSchema,
  updateOrderSchema,
} from "./order.validation.js";
import {
  createOrder,
  getOrderById,
  getOrders,
  getOrderStats,
  searchOrders,
  updateOrder,
} from "./order.controller.js";

const router = Router();

router.get("/", authenticate, getOrders);
router.post("/", authenticate, validate(createOrderSchema), createOrder);
router.get("/search", authenticate, searchOrders);
router.get("/stats", authenticate, getOrderStats);
router.get("/:id", authenticate, getOrderById);
router.put("/:id", authenticate, validate(updateOrderSchema), updateOrder);

export default router;
