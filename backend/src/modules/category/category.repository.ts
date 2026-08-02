import prisma from "../../config/database.js";
import { ICreateCategory } from "./category.interface.js";

const create = async (data: ICreateCategory) => {
  return prisma.category.create({ data });
};

const findAll = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { products: true },
  });
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
