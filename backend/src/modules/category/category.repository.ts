import prisma from "../../config/database.js";
import { ICreateCategory } from "./category.interface.js";

const create = async (data: ICreateCategory) => {
  return prisma.category.create({ data });
};

const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      skip: start,
      take: limit,
      include: { products: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where: { userId } }),
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
  return prisma.category.findUnique({ where: { id } });
};

const update = async (id: string, data: Partial<ICreateCategory>) => {
  return prisma.category.update({ where: { id }, data });
};

const remove = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export { create, findAll, findById, remove, update };
