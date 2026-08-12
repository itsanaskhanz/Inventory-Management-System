import type { Order } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import {
  OrderStatus,
  getOrderPaymentStatus,
  type CreateOrderInput,
  type OrderItemInput,
  type OrderStatsData,
  type UpdateOrderInput,
} from "./order.interface.js";
import {
  cancelOrder,
  createOrder,
  findOrderById,
  getOrderStats,
  listOrders,
} from "./order.repository.js";

const createOrderService = async (
  data: CreateOrderInput,
  userId: string,
): Promise<ServiceResult<{ order: Order }>> => {
  const total = data.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cashReceived = data.cashReceived ?? 0;
  if (cashReceived > total) {
    throw new AppError(
      `Amount received cannot be greater than the total (${total})`,
      400,
      true,
    );
  }
  const due = Math.max(0, total - cashReceived);
  const status = getOrderPaymentStatus(total, cashReceived);

  const order = await createOrder({
    ...data,
    products: data.products,
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

const cancelOrderService = async (
  id: string,
  data: UpdateOrderInput,
  userId: string,
): Promise<ServiceResult<{ order: Order }>> => {
  const existing = await findOrderById(id);
  if (!existing) throw new AppError("Order not found", 404, true);
  ensureOwnership(existing, userId, "order");

  if (existing.status.toUpperCase() === OrderStatus.CANCELLED) {
    throw new AppError(
      "This order is already cancelled and cannot be modified",
      400,
      true,
    );
  }

  const status = data.status?.toUpperCase() as OrderStatus;
  if (status !== OrderStatus.CANCELLED) {
    throw new AppError(
      "Placed orders can only be cancelled; no other changes are allowed",
      400,
      true,
    );
  }

  const items: OrderItemInput[] = existing.products.map((product) => ({
    productId: product.productId,
    quantity: product.quantity,
    price: product.price,
  }));

  const order = await cancelOrder(id, items);
  return {
    statusCode: 200,
    message: "Order cancelled successfully",
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
  cancelOrderService,
  createOrderService,
  getOrderByIdService,
  getOrderStatsService,
  listOrdersService,
};