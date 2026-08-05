import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.validation.js";
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

router.post("/", authenticate, validate(createCustomerSchema), createCustomer);
router.get("/", authenticate, getAllCustomers);
router.get("/search", authenticate, searchCustomers);
router.get("/:id/orders", authenticate, getCustomerOrders);
router.get("/:id", authenticate, getCustomerById);
router.put("/:id", authenticate, validate(updateCustomerSchema), updateCustomer);
router.delete("/:id", authenticate, deleteCustomer);

export default router;
