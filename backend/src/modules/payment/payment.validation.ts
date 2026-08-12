import { z } from "zod";

export const createPaymentSchema = z.object({
  cashReceived: z
    .number()
    .int("Must be a whole number")
    .min(0, "Must be a non-negative number"),
  note: z.string().trim().max(500, "Note must be at most 500 characters").optional(),
});

export const cancelPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment id is required"),
});
