import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from "./product.controller.js";

const router = Router();

router.get("/", authenticate, getProducts);
router.post("/", authenticate, createProduct);
router.get("/search", authenticate, searchProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
