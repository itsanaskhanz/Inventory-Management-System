import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getPagination,
  getRouteId,
  getSearchParam,
  getUserId,
} from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerOrdersService,
  getCustomerPaymentSummaryService,
  listCustomersService,
  updateCustomerService,
} from "./customer.service.js";

const createCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await createCustomerService(req.body, getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getAllCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listCustomersService(getUserId(req), undefined, page, limit);
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const searchCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await listCustomersService(
      getUserId(req),
      getSearchParam(req),
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getCustomerOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    const result = await getCustomerOrdersService(
      getRouteId(req),
      getUserId(req),
      getSearchParam(req),
      page,
      limit,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getCustomerPaymentSummary = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getCustomerPaymentSummaryService(
      getRouteId(req),
      getUserId(req),
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const getCustomerById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getCustomerByIdService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const updateCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await updateCustomerService(
      getRouteId(req),
      getUserId(req),
      req.body,
    );
    successRes(res, result.message, result.statusCode, result.data);
  },
);

const deleteCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteCustomerService(getRouteId(req), getUserId(req));
    successRes(res, result.message, result.statusCode, result.data);
  },
);

export {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerOrders,
  getCustomerPaymentSummary,
  searchCustomers,
  updateCustomer,
};