import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import {
  ICreateProduct,
  IUpdateProduct,
} from "./product.interface.js";

interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

const buildWhere = (userId: string, filters: ProductFilters) => {
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

const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const where = buildWhere(userId, {});
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: start,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);
  return {
    products,
    pagination: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: end < total,
      hasPreviousPage: start > 0,
    },
  };
};

const searchAll = async (
  userId: string,
  filters: ProductFilters,
  start: number,
  end: number,
  limit: number,
) => {
  const where = buildWhere(userId, filters);
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: start,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);
  return {
    products,
    pagination: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: end < total,
      hasPreviousPage: start > 0,
    },
  };
};

const findById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  return product;
};

const create = async (data: ICreateProduct) => {
  return prisma.product.create({ data });
};

const update = async (id: string, data: IUpdateProduct) => {
  return prisma.product.update({ where: { id }, data });
};

const remove = async (id: string) => {
  return prisma.product.delete({ where: { id } });
};

const countByCategoryId = async (categoryId: string) => {
  return prisma.product.count({ where: { categoryId } });
};

export {
  countByCategoryId,
  create,
  findAll,
  findById,
  remove,
  searchAll,
  update,
};
