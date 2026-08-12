import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  cancelPayment,
  createPayment,
  getPayments,
} from "./payment.controller.js";
import {
  cancelPaymentSchema,
  createPaymentSchema,
} from "./payment.validation.js";

const router = Router();

router.post(
  "/cancel",
  authenticate,
  validate(cancelPaymentSchema),
  cancelPayment,
);
router.get("/:id", authenticate, getPayments);
router.post("/:id", authenticate, validate(createPaymentSchema), createPayment);

export default router;
