import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { Status } from "../../generated/prisma/enums.js";
import AppError from "../../utils/error.js";
import {
  ICreateOrder,
  ICreateOrderProduct,
  IUpdateOrder,
} from "./order.interface.js";

const getProductStatus = (stock: number, minStock: number): Status => {
  if (stock <= 0) return Status.OUT_OF_STOCK;
  if (stock <= minStock) return Status.LOW_STOCK;
  return Status.IN_STOCK;
};

const deductStock = async (
  tx: Prisma.TransactionClient,
  products: ICreateOrderProduct[],
) => {
  for (const item of products) {
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
  products: ICreateOrderProduct[],
) => {
  for (const item of products) {
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

const create = async (orderData: ICreateOrder) => {
  const { products } = orderData;

  return await prisma.$transaction(async (tx) => {
    await deductStock(tx, products);

    return await tx.order.create({
      data: {
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
        cashReceived: orderData.cashReceived ?? 0,
        due: orderData.due ?? 0,
        ...(orderData.status !== undefined && { status: orderData.status }),
        ...(orderData.userId !== undefined && { userId: orderData.userId }),
        customerId: orderData.customerId,
        products: {
          create: products.map((product: ICreateOrderProduct) => ({
            quantity: product.quantity,
            price: product.price,
            subtotal: product.subtotal,
            productId: product.productId,
          })),
        },
      } as Prisma.OrderUncheckedCreateInput,
    });
  });
};
const findAll = async (
  userId: string,
  start: number,
  end: number,
  limit: number,
) => {
  const where: Prisma.OrderWhereInput = { userId };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: start,
      take: limit,
      include: { products: true },
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

const searchAll = async (
  userId: string,
  search: string | undefined,
  start: number,
  end: number,
  limit: number,
) => {
  const where: Prisma.OrderWhereInput = { userId };
  if (search) {
    where.id = { contains: search, mode: "insensitive" };
  }
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: start,
      take: limit,
      include: { products: true, customer: true },
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

const findById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      products: { include: { product: true } },
      customer: true,
    },
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

const getStats = async (userId: string, from: Date, to: Date) => {
  const where: Prisma.OrderWhereInput = {
    userId,
    status: { equals: "COMPLETED", mode: "insensitive" },
  };
  const [allTime, dailyRows, profitRows, duesRows] = await Promise.all([
    prisma.order.aggregate({
      where,
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

  const daily = dailyRows.map((row) => ({
    date: row.date,
    revenue: Number(row.revenue),
    orders: Number(row.orders),
  }));

  return {
    totalRevenue: allTime._sum.total ?? 0,
    totalProfit: Number(profitRows[0]?.value ?? 0),
    totalOrders: allTime._count,
    totalDues: Number(duesRows[0]?.value ?? 0),
    daily,
  };
};

export type StockAction = "deduct" | "restore" | null;

const update = async (
  id: string,
  data: IUpdateOrder,
  stockAction: StockAction,
  products: ICreateOrderProduct[],
) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({ where: { id }, data });
    if (stockAction === "restore") {
      await restoreStock(tx, products);
    } else if (stockAction === "deduct") {
      await deductStock(tx, products);
    }
    return order;
  });
};

export { create, findAll, findById, getStats, searchAll, update };
