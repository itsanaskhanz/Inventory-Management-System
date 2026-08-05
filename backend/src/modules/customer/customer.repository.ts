import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ICreateCustomer } from "./customer.interface.js";

const create = async (data: ICreateCustomer) => {
  const customer = prisma.customer.create({
    data,
  });
  return customer;
};

const buildWhere = (userId: string, search?: string) => {
  const where: Prisma.CustomerWhereInput = { userId: userId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
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
  const where = buildWhere(userId);
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: start,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
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

const searchAll = async (
  userId: string,
  search: string | undefined,
  start: number,
  end: number,
  limit: number,
) => {
  const where = buildWhere(userId, search);
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: start,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
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
      _count: { select: { orders: true } },
    },
  });
};

const findOrdersByCustomerId = async (
  customerId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const where: Prisma.OrderWhereInput = { customerId };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: start,
      take: limit,
      include: { products: { include: { product: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: end < total,
      hasPreviousPage: start > 0,
    },
  };
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
export {
  create,
  deleteById,
  findAll,
  findById,
  findOrdersByCustomerId,
  searchAll,
  updateCustomer,
};
