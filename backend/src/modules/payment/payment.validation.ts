import { z } from "zod";

export const createPaymentSchema = z.object({
  cashReceived: z.number().min(0, "Must be a non-negative number"),
  note: z.string().trim().max(500, "Note must be at most 500 characters").optional(),
});
