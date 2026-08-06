import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getPagination,
  getRouteId,
  getSearchParam,
  getUserId,
} from "../../utils/request.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerOrdersService,
  listCustomersService,
  updateCustomerService,
} from "./customer.service.js";

const createCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await createCustomerService(req.body, getUserId(req)));
  },
);

const getAllCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await listCustomersService(getUserId(req), undefined, page, limit),
    );
  },
);

const searchCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await listCustomersService(getUserId(req), getSearchParam(req), page, limit),
    );
  },
);

const getCustomerOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = getPagination(req);
    sendSuccess(
      res,
      await getCustomerOrdersService(getRouteId(req), getUserId(req), page, limit),
    );
  },
);

const getCustomerById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await getCustomerByIdService(getRouteId(req), getUserId(req)),
    );
  },
);

const updateCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await updateCustomerService(getRouteId(req), getUserId(req), req.body),
    );
  },
);

const deleteCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await deleteCustomerService(getRouteId(req), getUserId(req)));
  },
);

export {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerOrders,
  searchCustomers,
  updateCustomer,
};