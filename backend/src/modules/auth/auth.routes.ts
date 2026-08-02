import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getUsersByRole,
  login,
  logout,
  profile,
  register,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.get("/getUsersByRole/:role", authenticate, getUsersByRole);

export default router;
