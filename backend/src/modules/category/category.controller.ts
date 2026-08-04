import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getRouteId } from "../../utils/helpers.js";
import { successRes } from "../../utils/response.js";
import type { IUser } from "../auth/auth.interface.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  searchCategoriesService,
  updateCategoryService,
} from "./category.service.js";

const getCurrentUserId = (req: AuthenticatedRequest): string => {
  return (req.user as IUser).id;
};

const createCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await createCategoryService(userId, req.body);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const updateCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await updateCategoryService(
      getRouteId(req.params.id),
      req.body,
      userId,
    );
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const deleteCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await deleteCategoryService(getRouteId(req.params.id), userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getCategoryById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await getCategoryByIdService(
      getRouteId(req.params.id),
      userId,
    );
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const searchCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const data = await searchCategoriesService(userId, search, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const data = await getCategoriesService(userId, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
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
