import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
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

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deleteAccount);
router.get("/getUsersByRole/:role", authenticate, getUsersByRole);

export default router;
