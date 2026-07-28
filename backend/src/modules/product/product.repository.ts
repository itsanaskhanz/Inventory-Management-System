import prisma from "../../config/database.js";
import { ICreateProduct } from "./product.interface.js";

const findAll = async (userId: string) => {
  const products = await prisma.product.findMany({ where: { userId } });
  return products;
};

const findById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
};
const create = async (data: ICreateProduct) => {
  const Product = await prisma.product.create({ data });
  return Product;
};

const update = async (id: string, data: {}) => {
  const product = await prisma.product.update({ where: { id }, data });
  return product;
};

const remove = async (id: string) => {
  const product = await prisma.product.delete({ where: { id } });
  return product;
};

export { findById, findAll, create, remove, update };
