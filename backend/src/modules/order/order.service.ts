import AppError from "../../utils/error.js";
import type { ICreateOrder, ICreateOrderProduct, IUpdateOrder } from "./order.interface.js";
import {
  create,
  findAll,
  findById,
  getStats,
  searchAll,
  update,
  type StockAction,
} from "./order.repository.js";

const STOCK_HOLDING_STATUSES = new Set(["PENDING", "COMPLETED"]);
const STOCK_RESTORING_STATUSES = new Set(["CANCELLED"]);

const ensureOwnership = (order: { userId: string | null }, userId: string) => {
  if (!order.userId || order.userId !== userId) {
    throw new AppError(
      "You do not have permission to access this order",
      403,
      true,
    );
  }
};

const createOrderService = async (data: ICreateOrder, userId: string) => {
  const products = data.products.map((p) => ({
    productId: p.productId,
    quantity: p.quantity,
    price: p.price,
  }));

  const subtotal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  const tax = data.tax;
  const total = subtotal + tax;
  const cashReceived = data.cashReceived ?? 0;
  const due = Math.max(0, total - cashReceived);
  const status = due <= 0 ? "COMPLETED" : "PENDING";

  const order = await create({
    ...data,
    products: products.map((p) => ({ ...p, subtotal: p.price * p.quantity })),
    subtotal,
    tax,
    total,
    cashReceived,
    due,
    status,
    userId,
  });

  return {
    message: "Order created successfully",
    statusCode: 201,
    data: { order },
  };
};

const getOrdersService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const { orders, pagination } = await findAll(userId, start, end, limit);

  return {
    statusCode: 200,
    message: "Orders fetched successfully",
    data: { orders, pagination },
  };
};

const getOrderByIdService = async (id: string, userId: string) => {
  const order = await findById(id);
  if (!order) {
    throw new AppError("Order not found", 404, true);
  }
  ensureOwnership(order, userId);
  return {
    statusCode: 200,
    message: "Order fetched successfully",
    data: { order },
  };
};

const searchOrdersService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const { orders, pagination } = await searchAll(
    userId,
    search,
    start,
    end,
    limit,
  );
  return {
    statusCode: 200,
    message: "Orders fetched successfully",
    data: { orders, pagination },
  };
};

const updateOrderService = async (
  id: string,
  data: IUpdateOrder,
  userId: string,
) => {
  const exists = await findById(id);
  if (!exists) {
    throw new AppError("Order not found", 404, true);
  }
  ensureOwnership(exists, userId);

  const previousStatus = exists.status.toUpperCase();
  const cashReceived = data.cashReceived ?? exists.cashReceived;
  const due = Math.max(0, exists.total - cashReceived);

  const requestedStatus = (data.status ?? previousStatus).toUpperCase();

  let nextStatus = requestedStatus;
  if (
    nextStatus !== "CANCELLED" &&
    data.cashReceived !== undefined &&
    previousStatus !== "CANCELLED"
  ) {
    nextStatus = due <= 0 ? "COMPLETED" : "PENDING";
  }

  let stockAction: StockAction = null;
  if (previousStatus !== nextStatus) {
    if (
      STOCK_HOLDING_STATUSES.has(previousStatus) &&
      STOCK_RESTORING_STATUSES.has(nextStatus)
    ) {
      stockAction = "restore";
    } else if (
      STOCK_RESTORING_STATUSES.has(previousStatus) &&
      STOCK_HOLDING_STATUSES.has(nextStatus)
    ) {
      stockAction = "deduct";
    }
  }

  const products: ICreateOrderProduct[] = exists.products.map((p) => ({
    productId: p.productId,
    quantity: p.quantity,
    price: p.price,
    subtotal: p.subtotal,
  }));

  const order = await update(
    id,
    { ...data, status: nextStatus, cashReceived, due },
    stockAction,
    products,
  );
  return {
    statusCode: 200,
    message: "Order updated successfully",
    data: { order },
  };
};

const getOrderStatsService = async (
  userId: string,
  from?: Date,
  to?: Date,
) => {
  const start = from ?? new Date(0);
  const end = to ?? new Date("2100-01-01T23:59:59.999Z");
  const { totalRevenue, totalProfit, totalOrders, totalDues, daily } =
    await getStats(userId, start, end);
  const rangeRevenue = daily.reduce((sum, d) => sum + d.revenue, 0);
  const rangeOrders = daily.reduce((sum, d) => sum + d.orders, 0);
  return {
    statusCode: 200,
    message: "Order statistics fetched successfully",
    data: {
      totalRevenue,
      totalProfit,
      totalOrders,
      totalDues,
      rangeRevenue,
      rangeOrders,
      dailyRevenue: daily,
    },
  };
};

export {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  getOrderStatsService,
  searchOrdersService,
  updateOrderService,
};
