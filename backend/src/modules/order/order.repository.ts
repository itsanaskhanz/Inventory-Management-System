import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { buildPagination } from "../../utils/pagination.js";
import { getProductStatus } from "../../utils/productStatus.js";
import type {
  CreateOrderData,
  OrderItemInput,
  UpdateOrderInput,
} from "./order.interface.js";

export type StockAction = "deduct" | "restore" | null;

const deductStock = async (
  tx: Prisma.TransactionClient,
  items: OrderItemInput[],
) => {
  for (const item of items) {
    const product = await tx.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      throw new AppError("One or more products not found", 404, true);
    }
    if (!product.isActive) {
      throw new AppError(`Product "${product.name}" is inactive`, 400, true);
    }
    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product "${product.name}"`,
        400,
        true,
      );
    }

    const newStock = product.stock - item.quantity;
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: newStock,
        status: getProductStatus(newStock, product.minStock),
      },
    });
  }
};

const restoreStock = async (
  tx: Prisma.TransactionClient,
  items: OrderItemInput[],
) => {
  for (const item of items) {
    const product = await tx.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      throw new AppError("One or more products not found", 404, true);
    }

    const newStock = product.stock + item.quantity;
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: newStock,
        status: getProductStatus(newStock, product.minStock),
      },
    });
  }
};

const createOrder = async (data: CreateOrderData) => {
  return prisma.$transaction(async (tx) => {
    await deductStock(tx, data.products);

    return tx.order.create({
      data: {
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        cashReceived: data.cashReceived,
        due: data.due,
        status: data.status,
        userId: data.userId,
        customerId: data.customerId,
        products: {
          create: data.products.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal ?? item.price * item.quantity,
            productId: item.productId,
          })),
        },
      } as Prisma.OrderUncheckedCreateInput,
    });
  });
};

const buildWhere = (
  userId: string,
  search?: string,
): Prisma.OrderWhereInput => {
  const where: Prisma.OrderWhereInput = { userId };
  if (search) {
    where.id = { contains: search, mode: "insensitive" };
  }
  return where;
};

const listOrders = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const where = buildWhere(userId, search);
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { products: true, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, pagination: buildPagination(total, page, limit) };
};

const findOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      products: { include: { product: true } },
      customer: true,
    },
  });
};

const updateOrder = async (
  id: string,
  data: UpdateOrderInput,
  stockAction: StockAction,
  items: OrderItemInput[],
) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({ where: { id }, data });
    if (stockAction === "restore") {
      await restoreStock(tx, items);
    } else if (stockAction === "deduct") {
      await deductStock(tx, items);
    }
    return order;
  });
};

interface DailyRevenueRow {
  date: string;
  revenue: number;
  orders: number;
}

interface StatsValueRow {
  value: number;
}

const getOrderStats = async (userId: string, from: Date, to: Date) => {
  const completedOrders: Prisma.OrderWhereInput = {
    userId,
    status: { equals: "COMPLETED", mode: "insensitive" },
  };

  const [aggregate, dailyRevenueRows, profitRows, duesRows] = await Promise.all([
    prisma.order.aggregate({
      where: completedOrders,
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.$queryRaw<DailyRevenueRow[]>`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS date,
             COALESCE(SUM("total"), 0)::float8 AS revenue,
             COUNT(*)::int AS orders
      FROM "Order"
      WHERE "userId" = ${userId}
        AND UPPER("status") = 'COMPLETED'
        AND "createdAt" >= ${from}
        AND "createdAt" <= ${to}
      GROUP BY to_char("createdAt", 'YYYY-MM-DD')
      ORDER BY date ASC
    `,
    prisma.$queryRaw<StatsValueRow[]>`
      SELECT COALESCE(SUM((op."price" - p."costPrice") * op."quantity"), 0)::float8 AS value
      FROM "OrderProducts" op
      INNER JOIN "Order" o ON o."id" = op."orderId"
      INNER JOIN "Product" p ON p."id" = op."productId"
      WHERE o."userId" = ${userId}
        AND UPPER(o."status") = 'COMPLETED'
    `,
    prisma.$queryRaw<StatsValueRow[]>`
      SELECT COALESCE(SUM(o."due"), 0)::float8 AS value
      FROM "Order" o
      WHERE o."userId" = ${userId}
        AND UPPER(o."status") <> 'CANCELLED'
        AND o."due" > 0
    `,
  ]);

  return {
    totalRevenue: aggregate._sum.total ?? 0,
    totalProfit: Number(profitRows[0]?.value ?? 0),
    totalOrders: aggregate._count._all,
    totalDues: Number(duesRows[0]?.value ?? 0),
    daily: dailyRevenueRows.map((row) => ({
      date: row.date,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
    })),
  };
};

export { createOrder, findOrderById, getOrderStats, listOrders, updateOrder };