import {
  create,
  findAll,
  findById,
  remove,
  update,
} from "./product.repository.js";
import { ICreateProduct } from "./product.interface.js";
import AppError from "../../utils/error.js";

const getProductsService = async (userId: string) => {
  const products = await findAll(userId);
  return {
    statusCode: 200,
    message: "Products fetched successfully",
    data: { products: products },
  };
};
const getProductByIdService = async (id: string) => {
  const product = await findById(id);
  if (!product) {
    throw new AppError("Product not found", 404, true);
  }
  return {
    statusCode: 200,
    message: "Product fetched successfully",
    data: { product: product },
  };
};
const createProductService = async (data: ICreateProduct, userId: string) => {
  data.userId = userId;
  const product = await create(data);
  if (!product) {
    throw new AppError("Product not created", 400, true);
  }
  return {
    statusCode: 201,
    message: "Product created successfully",
    data: { product: product },
  };
};
const updateProductService = async (id: string, data: any) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Product not found", 404, true);
  }
  const products = await update(id, data);
  return {
    statusCode: 200,
    message: "Product updated successfully",
    data: { product: products },
  };
};
const deleteProductService = async (id: string) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Product not found", 404, true);
  }
  const product = await remove(id);
  return {
    statusCode: 200,
    message: "Product deleted successfully",
    data: { product: product },
  };
};

export {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
