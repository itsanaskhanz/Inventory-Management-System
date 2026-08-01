import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getAdmins,
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
router.get("/getAdmins", authenticate, getAdmins);

export default router;
