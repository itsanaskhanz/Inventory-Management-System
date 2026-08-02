import AppError from "../../utils/error.js";
import {
  ICreateProduct,
  IUpdateProduct,
} from "./product.interface.js";
import {
  create,
  findAll,
  findById,
  remove,
  update,
} from "./product.repository.js";
import { findById as findCategoryById } from "../category/category.repository.js";

const ensureOwnership = (product: { userId: string | null }, userId: string) => {
  if (!product.userId || product.userId !== userId) {
    throw new AppError(
      "You do not have permission to access this product",
      403,
      true,
    );
  }
};

const ensureCategoryBelongsToUser = async (
  categoryId: string | undefined | null,
  userId: string,
) => {
  if (!categoryId) return;
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404, true);
  }
  if (category.userId !== userId) {
    throw new AppError("Category does not belong to this user", 403, true);
  }
};

const getProductsService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const { products, pagination } = await findAll(userId, start, end, limit);
  return {
    statusCode: 200,
    message: "Products fetched successfully",
    data: { products, pagination },
  };
};

const getProductByIdService = async (id: string, userId: string) => {
  const product = await findById(id);
  if (!product) {
    throw new AppError("Product not found", 404, true);
  }
  ensureOwnership(product, userId);
  return {
    statusCode: 200,
    message: "Product fetched successfully",
    data: { product },
  };
};

const createProductService = async (data: ICreateProduct, userId: string) => {
  await ensureCategoryBelongsToUser(data.categoryId, userId);
  const product = await create({ ...data, userId });
  return {
    statusCode: 201,
    message: "Product created successfully",
    data: { product },
  };
};

const updateProductService = async (
  id: string,
  data: IUpdateProduct,
  userId: string,
) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Product not found", 404, true);
  }
  ensureOwnership(exists, userId);
  await ensureCategoryBelongsToUser(data.categoryId, userId);
  const product = await update(id, data);
  return {
    statusCode: 200,
    message: "Product updated successfully",
    data: { product },
  };
};

const deleteProductService = async (id: string, userId: string) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Product not found", 404, true);
  }
  ensureOwnership(exists, userId);
  const product = await remove(id);
  return {
    statusCode: 200,
    message: "Product deleted successfully",
    data: { product },
  };
};

export {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
};
