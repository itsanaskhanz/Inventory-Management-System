import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/error.js";
import {
  getPagination,
  getRouteId,
  getSearchParam,
  getStringParam,
  getUserId,
} from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import {
  createOrderService,
  getOrderByIdService,
  getOrderStatsService,
  listOrdersService,
  updateOrderService,
} from "./order.service.js";

const parseDateParam = (
  value: string | undefined,
  endOfDay: boolean,
): Date | undefined => {
  if (!value) return undefined;
  const date = endOfDay
    ? new Date(`${value}T23:59:59.999`)
    : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid date: ${value}`, 400, true);
  }
  return date;
};

const createOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await createOrderService(req.body, getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listOrdersService(getUserId(req), undefined, page, limit);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getOrderById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getOrderByIdService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const searchOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listOrdersService(
      getUserId(req),
      getSearchParam(req),
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getOrderStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const from = parseDateParam(getStringParam(req, "from"), false);
    const to = parseDateParam(getStringParam(req, "to"), true);
    const result = await getOrderStatsService(getUserId(req), from, to);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const updateOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await updateOrderService(
      getRouteId(req),
      req.body,
      getUserId(req),
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

export {
  createOrder,
  getOrderById,
  getOrders,
  getOrderStats,
  searchOrders,
  updateOrder,
};