import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation.js";
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
router.post("/", authenticate, validate(createProductSchema), createProduct);
router.get("/search", authenticate, searchProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
