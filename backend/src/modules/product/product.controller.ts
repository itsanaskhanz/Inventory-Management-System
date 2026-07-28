import type { Request, Response } from "express";
import AppError from "../../utils/error.js";
import { errorRes, successRes } from "../../utils/response.js";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "./product.service.js";

const getProducts = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const data = await getProductsService(userId);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const getProductById = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await getProductByIdService(id);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const createProduct = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const data = await createProductService(body, userId);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const updateProduct = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const data = await updateProductService(id, body);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const deleteProduct = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await deleteProductService(id);
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
  getProductById,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
