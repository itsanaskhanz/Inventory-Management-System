import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/error.js";
import { getRouteId } from "../../utils/helpers.js";
import { successRes } from "../../utils/response.js";
import type { IUser } from "../auth/auth.interface.js";
import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  getOrderStatsService,
  searchOrdersService,
  updateOrderService,
} from "./order.service.js";

const getCurrentUserId = (req: AuthenticatedRequest): string => {
  return (req.user as IUser).id;
};

const createOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await createOrderService(req.body, userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const data = await getOrdersService(userId, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getOrderById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const orderId = getRouteId(req.params.id);
    const data = await getOrderByIdService(orderId, userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const searchOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;
    const data = await searchOrdersService(userId, search, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getOrderStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const rawFrom =
      typeof req.query.from === "string" ? req.query.from.trim() : "";
    const rawTo = typeof req.query.to === "string" ? req.query.to.trim() : "";
    const from = rawFrom ? new Date(`${rawFrom}T00:00:00`) : undefined;
    const to = rawTo ? new Date(`${rawTo}T23:59:59.999`) : undefined;
    if (from && Number.isNaN(from.getTime())) {
      throw new AppError("Invalid from date", 400, true);
    }
    if (to && Number.isNaN(to.getTime())) {
      throw new AppError("Invalid to date", 400, true);
    }
    const data = await getOrderStatsService(userId, from, to);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const updateOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await updateOrderService(
      getRouteId(req.params.id),
      req.body,
      userId,
    );
    successRes(res, data.message, data.statusCode, data.data);
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
