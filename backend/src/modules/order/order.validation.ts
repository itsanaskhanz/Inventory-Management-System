import { z } from "zod";
import { OrderStatus } from "./order.interface.js";

export const orderStatusSchema = z.nativeEnum(OrderStatus);

const nonNegativeInteger = z
  .number()
  .int("Must be a whole number")
  .min(0, "Must be a non-negative number");

export const createOrderSchema = z.object({
  cashReceived: nonNegativeInteger.optional(),
  customerId: z.string().trim().min(1).nullable().optional(),
  products: z
    .array(
      z.object({
        productId: z.string().trim().min(1, "Product id is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
        price: nonNegativeInteger,
      }),
    )
    .min(1, "At least one product is required"),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
});