import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.validation.js";
import {
  deleteAccount,
  getUsersByRole,
  login,
  logout,
  profile,
  register,
  updateProfile,
} from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfile,
);
router.delete("/profile", authenticate, deleteAccount);
router.get("/getUsersByRole/:role", authenticate, getUsersByRole);

export default router;
