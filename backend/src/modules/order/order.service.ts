import type { Order } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import {
  OrderStatus,
  type CreateOrderInput,
  type OrderItemInput,
  type OrderStatsData,
  type UpdateOrderInput,
} from "./order.interface.js";
import {
  createOrder,
  findOrderById,
  getOrderStats,
  listOrders,
  updateOrder,
  type StockAction,
} from "./order.repository.js";

const STOCK_HOLDING_STATUSES = new Set<OrderStatus>([
  OrderStatus.PENDING,
  OrderStatus.COMPLETED,
]);
const STOCK_RESTORING_STATUSES = new Set<OrderStatus>([OrderStatus.CANCELLED]);

const computePaymentStatus = (
  total: number,
  cashReceived: number,
): OrderStatus =>
  total - cashReceived <= 0 ? OrderStatus.COMPLETED : OrderStatus.PENDING;

const getStockAction = (
  previousStatus: OrderStatus,
  nextStatus: OrderStatus,
): StockAction => {
  if (
    STOCK_HOLDING_STATUSES.has(previousStatus) &&
    STOCK_RESTORING_STATUSES.has(nextStatus)
  ) {
    return "restore";
  }
  if (
    STOCK_RESTORING_STATUSES.has(previousStatus) &&
    STOCK_HOLDING_STATUSES.has(nextStatus)
  ) {
    return "deduct";
  }
  return null;
};

const createOrderService = async (
  data: CreateOrderInput,
  userId: string,
): Promise<ServiceResult<{ order: Order }>> => {
  const items: OrderItemInput[] = data.products.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
  const total = subtotal + data.tax;
  const cashReceived = data.cashReceived ?? 0;
  const due = Math.max(0, total - cashReceived);
  const status = computePaymentStatus(total, cashReceived);

  const order = await createOrder({
    ...data,
    products: items,
    subtotal,
    total,
    cashReceived,
    due,
    status,
    userId,
  });
  return {
    statusCode: 201,
    message: "Order created successfully",
    data: { order },
  };
};

const listOrdersService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
): Promise<ServiceResult<{ orders: Order[]; pagination: PaginationMeta }>> => {
  const { orders, pagination } = await listOrders(userId, search, page, limit);
  return {
    statusCode: 200,
    message: "Orders fetched successfully",
    data: { orders, pagination },
  };
};

const getOrderByIdService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ order: Order }>> => {
  const order = await findOrderById(id);
  if (!order) throw new AppError("Order not found", 404, true);
  ensureOwnership(order, userId, "order");

  return {
    statusCode: 200,
    message: "Order fetched successfully",
    data: { order },
  };
};

const updateOrderService = async (
  id: string,
  data: UpdateOrderInput,
  userId: string,
): Promise<ServiceResult<{ order: Order }>> => {
  const existing = await findOrderById(id);
  if (!existing) throw new AppError("Order not found", 404, true);
  ensureOwnership(existing, userId, "order");

  const previousStatus = existing.status.toUpperCase() as OrderStatus;
  const cashReceived = data.cashReceived ?? existing.cashReceived;
  const due = Math.max(0, existing.total - cashReceived);

  let nextStatus = (data.status ?? previousStatus).toUpperCase() as OrderStatus;
  if (
    nextStatus !== OrderStatus.CANCELLED &&
    data.cashReceived !== undefined &&
    previousStatus !== OrderStatus.CANCELLED
  ) {
    nextStatus = computePaymentStatus(existing.total, cashReceived);
  }

  const stockAction = getStockAction(previousStatus, nextStatus);

  const items: OrderItemInput[] = existing.products.map((product) => ({
    productId: product.productId,
    quantity: product.quantity,
    price: product.price,
    subtotal: product.subtotal,
  }));

  const order = await updateOrder(
    id,
    { ...data, status: nextStatus, cashReceived, due },
    stockAction,
    items,
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
): Promise<ServiceResult<OrderStatsData>> => {
  const start = from ?? new Date(0);
  const end = to ?? new Date("2100-01-01T23:59:59.999Z");
  const { totalRevenue, totalProfit, totalOrders, totalDues, daily } =
    await getOrderStats(userId, start, end);

  const rangeRevenue = daily.reduce((sum, entry) => sum + entry.revenue, 0);
  const rangeOrders = daily.reduce((sum, entry) => sum + entry.orders, 0);

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
  getOrderStatsService,
  listOrdersService,
  updateOrderService,
};