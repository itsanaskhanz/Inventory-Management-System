import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getPagination, getRouteId, getUserId } from "../../utils/request.js";
import { sendSuccess } from "../../utils/response.js";
import { createPaymentService, getPaymentsService } from "./payment.service.js";

const createPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await createPaymentService(getRouteId(req), getUserId(req), req.body),
    );
  },
);

const getPayments = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await getPaymentsService(getRouteId(req), getUserId(req), page, limit),
    );
  },
);

export { createPayment, getPayments };
