import AppError from "../../utils/error.js";
import type { ICreateOrder, ICreateOrderProduct, IUpdateOrder } from "./order.interface.js";
import {
  create,
  findAll,
  findById,
  searchAll,
  update,
  type StockAction,
} from "./order.repository.js";

const STOCK_HOLDING_STATUSES = new Set(["PENDING", "COMPLETED"]);
const STOCK_RESTORING_STATUSES = new Set(["CANCELLED"]);
const VALID_ORDER_STATUSES = [
  ...STOCK_HOLDING_STATUSES,
  ...STOCK_RESTORING_STATUSES,
];

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
  const nextStatus = (data.status ?? previousStatus).toUpperCase();
  if (!VALID_ORDER_STATUSES.includes(nextStatus)) {
    throw new AppError(
      `Invalid order status. Must be one of: ${VALID_ORDER_STATUSES.join(", ")}`,
      400,
      true,
    );
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
    { ...data, status: nextStatus },
    stockAction,
    products,
  );
  return {
    statusCode: 200,
    message: "Order updated successfully",
    data: { order },
  };
};

export {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  searchOrdersService,
  updateOrderService,
};
