import type { Category } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import { countProductsByCategoryId } from "../product/product.repository.js";
import type { CategoryWithCount, ICreateCategory } from "./category.interface.js";
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  listCategories,
  updateCategory,
} from "./category.repository.js";

const toCategoryWithCount = (category: {
  _count?: { products?: number };
}): CategoryWithCount => {
  const { _count, ...rest } = category;
  return { ...rest, productsCount: _count?.products ?? 0 } as CategoryWithCount;
};

const createCategoryService = async (
  userId: string,
  data: ICreateCategory,
): Promise<ServiceResult<{ category: Category }>> => {
  const category = await createCategory({ name: data.name, userId });
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
): Promise<ServiceResult<{ category: Category }>> => {
  const existing = await findCategoryById(id);
  if (!existing) throw new AppError("Category not found", 404, true);
  ensureOwnership(existing, userId, "category");

  const category = await updateCategory(id, data);
  return {
    statusCode: 200,
    message: "Category updated successfully",
    data: { category },
  };
};

const deleteCategoryService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ category: Category }>> => {
  const existing = await findCategoryById(id);
  if (!existing) throw new AppError("Category not found", 404, true);
  ensureOwnership(existing, userId, "category");

  const productCount = await countProductsByCategoryId(id);
  if (productCount > 0) {
    throw new AppError(
      "Cannot delete category with products. Reassign or delete its products first.",
      400,
      true,
    );
  }

  const category = await deleteCategory(id);
  return {
    statusCode: 200,
    message: "Category deleted successfully",
    data: { category },
  };
};

const getCategoryByIdService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ category: CategoryWithCount }>> => {
  const category = await findCategoryById(id);
  if (!category) throw new AppError("Category not found", 404, true);
  ensureOwnership(category, userId, "category");

  return {
    statusCode: 200,
    message: "Category found successfully",
    data: { category: toCategoryWithCount(category) },
  };
};

const listCategoriesService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
): Promise<
  ServiceResult<{ categories: CategoryWithCount[]; pagination: PaginationMeta }>
> => {
  const { categories, pagination } = await listCategories(
    userId,
    search,
    page,
    limit,
  );
  return {
    statusCode: 200,
    message: "Categories found successfully",
    data: { categories: categories.map(toCategoryWithCount), pagination },
  };
};

export {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  listCategoriesService,
  updateCategoryService,
};