import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getPagination, getRouteId, getUserId } from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import {
  cancelPaymentService,
  createPaymentService,
  getPaymentsService,
} from "./payment.service.js";

const createPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await createPaymentService(
      getRouteId(req),
      getUserId(req),
      req.body,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const cancelPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await cancelPaymentService(getUserId(req), req.body);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getPayments = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await getPaymentsService(
      getRouteId(req),
      getUserId(req),
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

export { cancelPayment, createPayment, getPayments };
