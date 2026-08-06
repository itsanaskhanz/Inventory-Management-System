import type { Customer, Order } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import type {
  CustomerOrdersSummary,
  ICreateCustomer,
  IUpdateCustomerData,
} from "./customer.interface.js";
import {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  findCustomerByPhone,
  findOrdersByCustomerId,
  listCustomers,
  updateCustomer,
} from "./customer.repository.js";

const ensureUniquePhone = async (
  userId: string,
  phone: string | undefined,
  excludeCustomerId?: string,
) => {
  if (!phone) return;
  const existing = await findCustomerByPhone(userId, phone);
  if (existing && existing.id !== excludeCustomerId) {
    throw new AppError(
      "Customer with this phone number already exists",
      409,
      true,
    );
  }
};

const createCustomerService = async (
  data: ICreateCustomer,
  userId: string,
): Promise<ServiceResult<{ customer: Customer }>> => {
  await ensureUniquePhone(userId, data.phone);

  const customer = await createCustomer({ ...data, userId });
  return {
    statusCode: 201,
    message: "Customer created successfully",
    data: { customer },
  };
};

const listCustomersService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
): Promise<ServiceResult<{ customers: Customer[]; pagination: PaginationMeta }>> => {
  const { customers, pagination } = await listCustomers(userId, search, page, limit);
  return {
    statusCode: 200,
    message: "Customers fetched successfully",
    data: { customers, pagination },
  };
};

const getCustomerByIdService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ customer: Customer }>> => {
  const customer = await findCustomerById(id);
  if (!customer) throw new AppError("Customer not found", 404, true);
  ensureOwnership(customer, userId, "customer");

  return {
    statusCode: 200,
    message: "Customer fetched successfully",
    data: { customer },
  };
};

const getCustomerOrdersService = async (
  customerId: string,
  userId: string,
  page: number,
  limit: number,
): Promise<
  ServiceResult<{
    orders: Order[];
    pagination: PaginationMeta;
    summary: CustomerOrdersSummary;
  }>
> => {
  const customer = await findCustomerById(customerId);
  if (!customer) throw new AppError("Customer not found", 404, true);
  ensureOwnership(customer, userId, "customer");

  const result = await findOrdersByCustomerId(customerId, page, limit);
  return {
    statusCode: 200,
    message: "Customer orders fetched successfully",
    data: result,
  };
};

const updateCustomerService = async (
  id: string,
  userId: string,
  data: IUpdateCustomerData,
): Promise<ServiceResult<{ customer: Customer }>> => {
  const existing = await findCustomerById(id);
  if (!existing) throw new AppError("Customer not found", 404, true);
  ensureOwnership(existing, userId, "customer");
  await ensureUniquePhone(userId, data.phone, id);

  const customer = await updateCustomer(id, data);
  return {
    statusCode: 200,
    message: "Customer updated successfully",
    data: { customer },
  };
};

const deleteCustomerService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<null>> => {
  const existing = await findCustomerById(id);
  if (!existing) throw new AppError("Customer not found", 404, true);
  ensureOwnership(existing, userId, "customer");

  await deleteCustomer(id);
  return {
    statusCode: 200,
    message: "Customer deleted successfully",
    data: null,
  };
};

export {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerOrdersService,
  listCustomersService,
  updateCustomerService,
};