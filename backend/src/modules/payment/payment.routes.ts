import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { createPayment, getPayments } from "./payment.controller.js";
import { createPaymentSchema } from "./payment.validation.js";

const router = Router();

router.get("/:id", authenticate, getPayments);
router.post("/:id", authenticate, validate(createPaymentSchema), createPayment);

export default router;
