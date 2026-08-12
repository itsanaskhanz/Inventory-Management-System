import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getPagination,
  getRouteId,
  getSearchParam,
  getUserId,
} from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  listCategoriesService,
  updateCategoryService,
} from "./category.service.js";

const createCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await createCategoryService(getUserId(req), req.body);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const updateCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await updateCategoryService(
      getRouteId(req),
      req.body,
      getUserId(req),
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const deleteCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteCategoryService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getCategoryById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getCategoryByIdService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listCategoriesService(
      getUserId(req),
      undefined,
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const searchCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listCategoriesService(
      getUserId(req),
      getSearchParam(req),
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  searchCategories,
  updateCategory,
};