import type { Request, Response } from "express";
import AppError from "../../utils/error.js";
import { errorRes, successRes } from "../../utils/response.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "./category.service.js";
const createCategory = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const data = await createCategoryService(userId, body);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const updateCategory = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const data = await updateCategoryService(id, body);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const deleteCategory = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await deleteCategoryService(id);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const getCategoryById = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await getCategoryByIdService(id);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const getCategories = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const data = await getCategoriesService(userId);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
};
