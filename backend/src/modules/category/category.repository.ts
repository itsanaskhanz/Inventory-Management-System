import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ICreateCategory } from "./category.interface.js";

const create = async (data: ICreateCategory) => {
  return prisma.category.create({ data });
};

const buildWhere = (userId: string, search?: string) => {
  const where: Prisma.CategoryWhereInput = { userId };
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  return where;
};

const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const where = buildWhere(userId);
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: start,
      take: limit,
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where }),
  ]);
  return {
    categories,
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
  search: string | undefined,
  start: number,
  end: number,
  limit: number,
) => {
  const where = buildWhere(userId, search);
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: start,
      take: limit,
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where }),
  ]);
  return {
    categories,
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
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
};

const update = async (id: string, data: Partial<ICreateCategory>) => {
  return prisma.category.update({ where: { id }, data });
};

const remove = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export { create, findAll, findById, remove, searchAll, update };
