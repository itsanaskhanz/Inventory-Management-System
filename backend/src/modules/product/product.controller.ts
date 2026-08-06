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
import { sendSuccess } from "../../utils/response.js";
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
    sendSuccess(
      res,
      await listProductsService(getUserId(req), {}, page, limit),
    );
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
    sendSuccess(res, await listProductsService(getUserId(req), filters, page, limit));
  },
);

const getProductById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await getProductByIdService(getRouteId(req), getUserId(req)),
    );
  },
);

const createProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await createProductService(req.body, getUserId(req)));
  },
);

const updateProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await updateProductService(getRouteId(req), req.body, getUserId(req)),
    );
  },
);

const deleteProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await deleteProductService(getRouteId(req), getUserId(req)));
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