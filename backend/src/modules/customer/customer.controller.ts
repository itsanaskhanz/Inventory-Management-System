import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getRouteId } from "../../utils/helpers.js";
import { successRes } from "../../utils/response.js";
import { IUser } from "../auth/auth.interface.js";
import {
  createCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerOrdersService,
  searchCustomersService,
  updateCustomerService,
} from "./customer.service.js";

const getCurrentUserId = (req: AuthenticatedRequest): string => {
  return (req.user as IUser).id;
};

const createCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = getCurrentUserId(req);
    const data = await createCustomerService(req.body, userId);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getAllCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const userId = getCurrentUserId(req);
    const data = await getAllCustomersService(userId, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const searchCustomers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const userId = getCurrentUserId(req);
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;
    const data = await searchCustomersService(userId, search, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getCustomerOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const id = getRouteId(req.params.id);
    const data = await getCustomerOrdersService(id, page, limit);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getCustomerById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getRouteId(req.params.id);
    const data = await getCustomerByIdService(id);
    successRes(res, data.message, data.statusCode, data.data);
  },
);
const updateCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getRouteId(req.params.id);
    const data = await updateCustomerService(id, req.body);
    successRes(res, data.message, data.statusCode, data.data);
  },
);
const deleteCustomer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getRouteId(req.params.id);
    const data = await deleteCustomerService(id);
    successRes(res, data.message, data.statusCode);
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
