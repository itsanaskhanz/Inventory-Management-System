import AppError from "../../utils/error.js";
import { generateOrderNumber } from "../../utils/helpers.js";
import type { ICreateOrder } from "./order.interface.js";
import { create, findAll, findById, searchAll } from "./order.repository.js";

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
  const order = await create({
    ...data,
    orderNumber: data.orderNumber ?? generateOrderNumber(),
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

export {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  searchOrdersService,
};
