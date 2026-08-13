import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  deleteAccount,
  getUsersByRole,
  login,
  logout,
  profile,
  register,
  resendOTP,
  updateProfile,
  verifyEmail,
} from "./auth.controller.js";
import { loginSchema, registerSchema, resendOTPSchema, updateProfileSchema, verifyEmailSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", validate(resendOTPSchema), resendOTP);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfile);
router.delete("/profile", authenticate, deleteAccount);
router.get("/getUsersByRole/:role", authenticate, getUsersByRole);

export default router;
