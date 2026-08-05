import AppError from "../../utils/error.js";
import { countByCategoryId } from "../product/product.repository.js";
import { ICreateCategory } from "./category.interface.js";
import {
  create,
  findAll,
  findById,
  remove,
  searchAll,
  update,
} from "./category.repository.js";

const mapCategoryWithCount = <T extends { _count?: { products?: number } }>(
  category: T,
) => {
  const { _count, ...rest } = category;
  return { ...rest, productsCount: _count?.products ?? 0 };
};

const ensureOwnership = (
  category: { userId: string | null },
  userId: string,
) => {
  if (!category.userId || category.userId !== userId) {
    throw new AppError(
      "You do not have permission to access this category",
      403,
      true,
    );
  }
};

const createCategoryService = async (userId: string, data: ICreateCategory) => {
  const category = await create({ name: data.name, userId });
  return {
    statusCode: 201,
    message: "Category created successfully",
    data: { category },
  };
};

const updateCategoryService = async (
  id: string,
  data: Partial<ICreateCategory>,
  userId: string,
) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Category not found", 404, true);
  }
  ensureOwnership(exists, userId);
  const category = await update(id, data);
  return {
    statusCode: 200,
    message: "Category updated successfully",
    data: { category },
  };
};

const deleteCategoryService = async (id: string, userId: string) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Category not found", 404, true);
  }
  ensureOwnership(exists, userId);
  const productCount = await countByCategoryId(id);
  if (productCount > 0) {
    throw new AppError(
      "Cannot delete category with products. Reassign or delete its products first.",
      400,
      true,
    );
  }
  const category = await remove(id);
  return {
    statusCode: 200,
    message: "Category deleted successfully",
    data: { category },
  };
};

const getCategoryByIdService = async (id: string, userId: string) => {
  const category = await findById(id);
  if (!category) {
    throw new AppError("Category not found", 404, true);
  }
  ensureOwnership(category, userId);
  return {
    statusCode: 200,
    message: "Category found successfully",
    data: { category: mapCategoryWithCount(category) },
  };
};

const getCategoriesService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const { categories, pagination } = await findAll(userId, start, end, limit);
  return {
    statusCode: 200,
    message: "Categories found successfully",
    data: {
      categories: categories.map(mapCategoryWithCount),
      pagination,
    },
  };
};

const searchCategoriesService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const { categories, pagination } = await searchAll(
    userId,
    search,
    start,
    end,
    limit,
  );
  return {
    statusCode: 200,
    message: "Categories found successfully",
    data: {
      categories: categories.map(mapCategoryWithCount),
      pagination,
    },
  };
};

export {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  searchCategoriesService,
  updateCategoryService,
};
