import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otpCode: z.string().min(1, "OTP code is required"),
});

export const resendOTPSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otpCode: z.string().min(1, "OTP code is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, "Name must not be empty").optional(),
    email: z.string().trim().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
