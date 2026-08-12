import { z } from "zod";

const nonNegativeInteger = z
  .number()
  .int("Must be a whole number")
  .min(0, "Must be a non-negative number");

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().optional(),
  price: nonNegativeInteger,
  costPrice: nonNegativeInteger,
  stock: z
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer")
    .optional(),
  minStock: z
    .number()
    .int()
    .min(0, "Min stock must be a non-negative integer")
    .optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().trim().min(1).nullable().optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must not be empty")
    .max(200)
    .optional(),
  description: z.string().trim().nullable().optional(),
  price: nonNegativeInteger.optional(),
  costPrice: nonNegativeInteger.optional(),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer")
    .optional(),
  minStock: z
    .number()
    .int()
    .min(0, "Min stock must be a non-negative integer")
    .optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().trim().min(1).nullable().optional(),
});
