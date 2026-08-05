import { z } from "zod";

export const orderStatusSchema = z.enum(["PENDING", "COMPLETED", "CANCELLED"]);

const nonNegativeNumber = z
  .number()
  .min(0, "Must be a non-negative number");

export const createOrderSchema = z.object({
  subtotal: nonNegativeNumber.optional(),
  tax: nonNegativeNumber,
  total: nonNegativeNumber.optional(),
  cashReceived: nonNegativeNumber.optional(),
  status: orderStatusSchema.optional(),
  customerId: z.string().trim().min(1).nullable().optional(),
  products: z
    .array(
      z.object({
        productId: z.string().trim().min(1, "Product id is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
        price: nonNegativeNumber,
        subtotal: nonNegativeNumber.optional(),
      }),
    )
    .min(1, "At least one product is required"),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  customerId: z.string().trim().min(1).nullable().optional(),
  cashReceived: nonNegativeNumber.optional(),
});
