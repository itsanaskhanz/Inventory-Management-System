import type { Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { successRes } from "../../utils/response.js";
import { getRouteId } from "../../utils/helpers.js";
import type { IUser } from "../auth/auth.interface.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
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
    const data = await updateCategoryService(getRouteId(req.params.id), req.body, userId);
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
    const data = await getCategoryByIdService(getRouteId(req.params.id), userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await getCategoriesService(userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};
