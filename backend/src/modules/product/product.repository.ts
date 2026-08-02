import prisma from "../../config/database.js";
import {
  ICreateProduct,
  IUpdateProduct,
} from "./product.interface.js";

const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      skip: start,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { userId } }),
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

export { countByCategoryId, create, findAll, findById, remove, update };
