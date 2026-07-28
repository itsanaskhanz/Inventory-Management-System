import AppError from "../../utils/error.js";
import { ICreateCategory } from "./category.interface.js";
import {
  create,
  findAll,
  findById,
  remove,
  update,
} from "./category.repository.js";

const createCategoryService = async (userId: string, data: ICreateCategory) => {
  data.userId = userId;
  const category = await create(data);
  if (!category) {
    throw new AppError("Category not created", 400, true);
  }
  return {
    statusCode: 201,
    message: "Category created successfully",
    data: { category: category },
  };
};
const updateCategoryService = async (id: string, data: ICreateCategory) => {
  const category = await update(data, id);
  if (!category) {
    throw new AppError("Category not updated", 400, true);
  }
  return {
    statusCode: 200,
    message: "Category updated successfully",
    data: { category: category },
  };
};
const deleteCategoryService = async (id: string) => {
  const category = await remove(id);
  if (!category) {
    throw new AppError("Category not deleted", 400, true);
  }
  return {
    statusCode: 200,
    message: "Category deleted successfully",
    data: { category: category },
  };
};
const getCategoryByIdService = async (id: string) => {
  const category = await findById(id);
  if (!category) {
    throw new AppError("Category not found", 404, true);
  }
  return {
    statusCode: 200,
    message: "Category found successfully",
    data: { category: category },
  };
};
const getCategoriesService = async (userId: string) => {
  const categories = await findAll(userId);
  return {
    statusCode: 200,
    message: "Categories found successfully",
    data: { categories: categories },
  };
};

export {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoriesService,
};
