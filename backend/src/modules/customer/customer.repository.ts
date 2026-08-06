import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { buildPagination } from "../../utils/pagination.js";
import type { ICreateCustomer, IUpdateCustomerData } from "./customer.interface.js";

const buildWhere = (
  userId: string,
  search?: string,
): Prisma.CustomerWhereInput => {
  const where: Prisma.CustomerWhereInput = { userId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
};

const listCustomers = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const where = buildWhere(userId, search);
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);
  return { customers, pagination: buildPagination(total, page, limit) };
};

const findCustomerById = async (id: string) => {
  return prisma.customer.findUnique({
    where: { id },
    include: { _count: { select: { orders: true } } },
  });
};

const findCustomerByPhone = async (userId: string, phone: string) => {
  return prisma.customer.findFirst({ where: { userId, phone } });
};

const findOrdersByCustomerId = async (
  customerId: string,
  page: number,
  limit: number,
) => {
  const where: Prisma.OrderWhereInput = { customerId };
  const [orders, total, totals] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { products: { include: { product: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({
      where: { customerId },
      _sum: { total: true, cashReceived: true, due: true },
    }),
  ]);
  return {
    orders,
    pagination: buildPagination(total, page, limit),
    summary: {
      totalOrders: total,
      totalAmount: totals._sum.total ?? 0,
      totalCashReceived: totals._sum.cashReceived ?? 0,
      totalDue: totals._sum.due ?? 0,
    },
  };
};

const createCustomer = async (data: ICreateCustomer) => {
  return prisma.customer.create({ data });
};

const updateCustomer = async (id: string, data: IUpdateCustomerData) => {
  return prisma.customer.update({ where: { id }, data });
};

const deleteCustomer = async (id: string) => {
  return prisma.customer.delete({ where: { id } });
};

export {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  findCustomerByPhone,
  findOrdersByCustomerId,
  listCustomers,
  updateCustomer,
};