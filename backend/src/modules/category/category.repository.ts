import prisma from "../../config/database.js";
import { ICreateCategory } from "./category.interface.js";

const create = async (data: ICreateCategory) => {
  const category = await prisma.category.create({ data });
  return category;
};
const findAll = async (userId: string) => {
  const categories = await prisma.category.findMany({ where: { userId } });
  return categories;
};
const findById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  return category;
};
const remove = async (id: string) => {
  const category = await prisma.category.delete({ where: { id } });
  return category;
};
const update = async (data: ICreateCategory, id: string) => {
  const category = await prisma.category.update({ where: { id }, data });
  return category;
};

export { create, findAll, findById, remove, update };
