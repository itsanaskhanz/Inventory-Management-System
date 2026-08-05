import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  searchCategories,
  updateCategory,
} from "./category.controller.js";
const router = Router();

router.get("/", authenticate, getCategories);
router.post("/", authenticate, validate(createCategorySchema), createCategory);
router.get("/search", authenticate, searchCategories);
router.get("/:id", authenticate, getCategoryById);
router.put("/:id", authenticate, validate(updateCategorySchema), updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
