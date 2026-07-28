import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
const router = Router();

router.get("/", authenticate, getCategories);
router.post("/", authenticate, createCategory);
router.get("/:id", authenticate, getCategoryById);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
