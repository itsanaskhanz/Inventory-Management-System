import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { buildPagination } from "../../utils/pagination.js";
import type {
  ICreateProduct,
  IUpdateProduct,
  ProductFilters,
} from "./product.interface.js";

const buildWhere = (
  userId: string,
  filters: ProductFilters,
): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = { userId };
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return where;
};

const listProducts = async (
  userId: string,
  filters: ProductFilters,
  page: number,
  limit: number,
) => {
  const where = buildWhere(userId, filters);
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);
  return { products, pagination: buildPagination(total, page, limit) };
};

const findProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

const createProduct = async (data: ICreateProduct) => {
  return prisma.product.create({ data });
};

const updateProduct = async (id: string, data: IUpdateProduct) => {
  return prisma.product.update({ where: { id }, data });
};

const deleteProduct = async (id: string) => {
  return prisma.product.delete({ where: { id } });
};

const countProductsByCategoryId = async (categoryId: string) => {
  return prisma.product.count({ where: { categoryId } });
};

export {
  countProductsByCategoryId,
  createProduct,
  deleteProduct,
  findProductById,
  listProducts,
  updateProduct,
};