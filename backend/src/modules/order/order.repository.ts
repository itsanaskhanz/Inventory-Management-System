import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { buildPagination } from "../../utils/pagination.js";
import { getProductStatus } from "../../utils/productStatus.js";
import {
  adjustPaymentsForCancelledOrder,
  createPaymentForOrder,
} from "../payment/payment.repository.js";
import {
  OrderStatus,
  type CreateOrderData,
  type OrderItemInput,
} from "./order.interface.js";

const deductStock = async (
  tx: Prisma.TransactionClient,
  items: OrderItemInput[],
): Promise<OrderItemInput[]> => {
  const stockDeductedItems: OrderItemInput[] = [];
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

    stockDeductedItems.push({
      ...item,
      costPrice: item.costPrice ?? product.costPrice,
    });
  }
  return stockDeductedItems;
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
    const stockDeductedItems = await deductStock(tx, data.products);

    const order = await tx.order.create({
      data: {
        total: data.total,
        cashReceived: data.cashReceived,
        due: data.due,
        status: data.status,
        userId: data.userId,
        customerId: data.customerId,
        products: {
          create: stockDeductedItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice ?? 0,
            productId: item.productId,
          })),
        },
      } as Prisma.OrderUncheckedCreateInput,
    });

    if (data.customerId && data.cashReceived > 0) {
      await createPaymentForOrder(
        tx,
        data.customerId,
        order.id,
        data.cashReceived,
      );
    }

    return order;
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

const cancelOrder = async (id: string, items: OrderItemInput[]) => {
  return prisma.$transaction(async (tx) => {
    await restoreStock(tx, items);
    await adjustPaymentsForCancelledOrder(tx, id);
    return tx.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
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
  // All orders except cancelled
  const activeOrders: Prisma.OrderWhereInput = {
    userId,
    status: { not: { equals: OrderStatus.CANCELLED }, mode: "insensitive" },
  };

  // Only completed orders
  const completedOrders: Prisma.OrderWhereInput = {
    userId,
    status: { equals: OrderStatus.COMPLETED, mode: "insensitive" },
  };

  const [aggregate, dailyRevenueRows, profitRows, duesRows] = await Promise.all(
    [
      // Revenue from ALL non-cancelled orders
      prisma.order.aggregate({
        where: activeOrders,
        _sum: { total: true },
        _count: { _all: true },
      }),
      // Daily revenue breakdown for ALL non-cancelled orders
      prisma.$queryRaw<DailyRevenueRow[]>`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS date,
             COALESCE(SUM("total"), 0)::int AS revenue,
             COUNT(*)::int AS orders
      FROM "Order"
      WHERE "userId" = ${userId}
        AND UPPER("status") <> 'CANCELLED'
        AND "createdAt" >= ${from}
        AND "createdAt" <= ${to}
      GROUP BY to_char("createdAt", 'YYYY-MM-DD')
      ORDER BY date ASC
    `,
      // Profit from COMPLETED orders only (uses cost price captured at order time)
      prisma.$queryRaw<StatsValueRow[]>`
      SELECT COALESCE(SUM((op."price" - op."costPrice") * op."quantity"), 0)::int AS value
      FROM "OrderProducts" op
      INNER JOIN "Order" o ON o."id" = op."orderId"
      WHERE o."userId" = ${userId}
        AND UPPER(o."status") = 'COMPLETED'
    `,
      // Dues from non-cancelled orders only
      prisma.$queryRaw<StatsValueRow[]>`
      SELECT COALESCE(SUM(o."due"), 0)::int AS value
      FROM "Order" o
      WHERE o."userId" = ${userId}
        AND UPPER(o."status") <> 'CANCELLED'
        AND o."due" > 0
    `,
    ],
  );

  return {
    totalRevenue: aggregate._sum.total ?? 0, // All non-cancelled
    totalProfit: Number(profitRows[0]?.value ?? 0), // Only completed
    totalOrders: aggregate._count._all, // All non-cancelled
    totalDues: Number(duesRows[0]?.value ?? 0), // All non-cancelled
    daily: dailyRevenueRows.map((row) => ({
      date: row.date,
      revenue: Number(row.revenue), // All non-cancelled
      orders: Number(row.orders), // All non-cancelled
    })),
  };
};

export { cancelOrder, createOrder, findOrderById, getOrderStats, listOrders };
