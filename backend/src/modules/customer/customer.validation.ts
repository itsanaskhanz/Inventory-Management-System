import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]{7,20}$/, "Invalid phone number");

export const createCustomerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name must not be empty")
      .max(200)
      .optional(),
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.phone !== undefined, {
    message: "Provide at least a name or phone number",
    path: ["name"],
  });

export const updateCustomerSchema = createCustomerSchema;
