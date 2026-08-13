import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  deleteAccount,
  forgotPassword,
  getUsersByRole,
  login,
  logout,
  profile,
  register,
  resendOTP,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "./auth.controller.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resendOTPSchema, resetPasswordSchema, updateProfileSchema, verifyEmailSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", validate(resendOTPSchema), resendOTP);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfile);
router.delete("/profile", authenticate, deleteAccount);
router.get("/getUsersByRole/:role", authenticate, getUsersByRole);

export default router;
