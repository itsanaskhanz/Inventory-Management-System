import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerOrders,
  searchCustomers,
  updateCustomer,
} from "./customer.controller.js";

const router = Router();

router.post("/", authenticate, createCustomer);
router.get("/", authenticate, getAllCustomers);
router.get("/search", authenticate, searchCustomers);
router.get("/:id/orders", authenticate, getCustomerOrders);
router.get("/:id", authenticate, getCustomerById);
router.put("/:id", authenticate, updateCustomer);
router.delete("/:id", authenticate, deleteCustomer);

export default router;
