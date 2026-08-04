import prisma from "../../config/database.js";
import { ICreateCustomer } from "./customer.interface.js";

const create = async (data: ICreateCustomer) => {
  const customer = prisma.customer.create({
    data,
  });
  return customer;
};

const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where: { userId: userId },
      skip: start,
      take: limit,
    }),
    prisma.customer.count({ where: { userId: userId } }),
  ]);

  return {
    customers,
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
  return prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        include: { products: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

const deleteById = async (id: string) => {
  return prisma.customer.delete({ where: { id } });
};
const updateCustomer = async (id: string, data: ICreateCustomer) => {
  return prisma.customer.update({
    where: { id },
    data,
  });
};
export { create, deleteById, findAll, findById, updateCustomer };
