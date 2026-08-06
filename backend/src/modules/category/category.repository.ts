import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { buildPagination } from "../../utils/pagination.js";
import type { ICreateCategory } from "./category.interface.js";

const buildWhere = (
  userId: string,
  search?: string,
): Prisma.CategoryWhereInput => {
  const where: Prisma.CategoryWhereInput = { userId };
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  return where;
};

const listCategories = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const where = buildWhere(userId, search);
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where }),
  ]);
  return { categories, pagination: buildPagination(total, page, limit) };
};

const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
};

const createCategory = async (data: ICreateCategory) => {
  return prisma.category.create({ data });
};

const updateCategory = async (id: string, data: Partial<ICreateCategory>) => {
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export {
  createCategory,
  deleteCategory,
  findCategoryById,
  listCategories,
  updateCategory,
};
