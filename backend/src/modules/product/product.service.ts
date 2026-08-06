import type { Product } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import { getProductStatus } from "../../utils/productStatus.js";
import type { ServiceResult } from "../../utils/response.js";
import { findCategoryById } from "../category/category.repository.js";
import type {
  ICreateProduct,
  IUpdateProduct,
  ProductFilters,
} from "./product.interface.js";
import {
  createProduct,
  deleteProduct,
  findProductById,
  listProducts,
  updateProduct,
} from "./product.repository.js";

const ensureCategoryBelongsToUser = async (
  categoryId: string | undefined | null,
  userId: string,
) => {
  if (!categoryId) return;

  const category = await findCategoryById(categoryId);
  if (!category) throw new AppError("Category not found", 404, true);
  if (category.userId !== userId) {
    throw new AppError("Category does not belong to this user", 403, true);
  }
};

const listProductsService = async (
  userId: string,
  filters: ProductFilters,
  page: number,
  limit: number,
): Promise<ServiceResult<{ products: Product[]; pagination: PaginationMeta }>> => {
  const { products, pagination } = await listProducts(userId, filters, page, limit);
  return {
    statusCode: 200,
    message: "Products fetched successfully",
    data: { products, pagination },
  };
};

const getProductByIdService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ product: Product }>> => {
  const product = await findProductById(id);
  if (!product) throw new AppError("Product not found", 404, true);
  ensureOwnership(product, userId, "product");

  return {
    statusCode: 200,
    message: "Product fetched successfully",
    data: { product },
  };
};

const createProductService = async (
  data: ICreateProduct,
  userId: string,
): Promise<ServiceResult<{ product: Product }>> => {
  await ensureCategoryBelongsToUser(data.categoryId, userId);

  const product = await createProduct({
    ...data,
    userId,
    status: getProductStatus(data.stock ?? 0, data.minStock ?? 5),
  });
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
): Promise<ServiceResult<{ product: Product }>> => {
  const existing = await findProductById(id);
  if (!existing) throw new AppError("Product not found", 404, true);
  ensureOwnership(existing, userId, "product");
  await ensureCategoryBelongsToUser(data.categoryId, userId);

  const newStock = data.stock ?? existing.stock;
  const newMinStock = data.minStock ?? existing.minStock;
  const product = await updateProduct(id, {
    ...data,
    status: getProductStatus(newStock, newMinStock),
  });
  return {
    statusCode: 200,
    message: "Product updated successfully",
    data: { product },
  };
};

const deleteProductService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ product: Product }>> => {
  const existing = await findProductById(id);
  if (!existing) throw new AppError("Product not found", 404, true);
  ensureOwnership(existing, userId, "product");

  const product = await deleteProduct(id);
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
  listProductsService,
  updateProductService,
};