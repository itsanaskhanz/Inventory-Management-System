import type { Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { successRes } from "../../utils/response.js";
import { getRouteId } from "../../utils/helpers.js";
import type { IUser } from "../auth/auth.interface.js";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  searchProductsService,
  updateProductService,
} from "./product.service.js";

const getCurrentUserId = (req: AuthenticatedRequest): string => {
  return (req.user as IUser).id;
};

const getProducts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const data = await getProductsService(userId, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const searchProducts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId.trim()
        : undefined;
    const isActive =
      req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
          ? false
          : undefined;
    const data = await searchProductsService(
      userId,
      { search, categoryId, isActive },
      page,
      limit,
    );
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getProductById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await getProductByIdService(getRouteId(req.params.id), userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const createProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await createProductService(req.body, userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const updateProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await updateProductService(getRouteId(req.params.id), req.body, userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const deleteProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await deleteProductService(getRouteId(req.params.id), userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

export {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
};
