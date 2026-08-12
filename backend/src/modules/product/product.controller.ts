import type { Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {
  getBooleanParam,
  getPagination,
  getRouteId,
  getSearchParam,
  getStringParam,
  getUserId,
} from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import type { ProductFilters } from "./product.interface.js";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  listProductsService,
  updateProductService,
} from "./product.service.js";

const getProducts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listProductsService(getUserId(req), {}, page, limit);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const searchProducts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const filters: ProductFilters = {
      search: getSearchParam(req),
      categoryId: getStringParam(req, "categoryId"),
      isActive: getBooleanParam(req, "isActive"),
    };
    const result = await listProductsService(getUserId(req), filters, page, limit);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getProductById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getProductByIdService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const createProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await createProductService(req.body, getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const updateProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await updateProductService(
      getRouteId(req),
      req.body,
      getUserId(req),
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const deleteProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteProductService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
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