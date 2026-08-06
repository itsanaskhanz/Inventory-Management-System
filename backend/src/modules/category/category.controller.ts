import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getPagination,
  getRouteId,
  getSearchParam,
  getUserId,
} from "../../utils/request.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  listCategoriesService,
  updateCategoryService,
} from "./category.service.js";

const createCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await createCategoryService(getUserId(req), req.body));
  },
);

const updateCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await updateCategoryService(getRouteId(req), req.body, getUserId(req)),
    );
  },
);

const deleteCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await deleteCategoryService(getRouteId(req), getUserId(req)));
  },
);

const getCategoryById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await getCategoryByIdService(getRouteId(req), getUserId(req)),
    );
  },
);

const getCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await listCategoriesService(getUserId(req), undefined, page, limit),
    );
  },
);

const searchCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await listCategoriesService(getUserId(req), getSearchParam(req), page, limit),
    );
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