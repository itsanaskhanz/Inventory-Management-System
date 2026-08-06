import {
  create,
  findAll,
  deleteById,
  findById,
  findOrdersByCustomerId,
  findByPhone,
  searchAll,
  updateCustomer,
} from "./customer.repository.js";
import AppError from "../../utils/error.js";

const createCustomerService = async (data: any, userId: string) => {
  if (data.phone) {
    const existing = await findByPhone(userId, data.phone);
    if (existing) {
      throw new AppError(
        "Customer with this phone number already exists",
        409,
        true,
      );
    }
  }
  const customer = await create({ ...data, userId });
  return {
    statusCode: 201,
    message: "Customer created successfully",
    data: { customer },
  };
};

const getAllCustomersService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const result = await findAll(userId, start, end, limit);
  return {
    statusCode: 200,
    message: "Customers fetched successfully",
    data: result,
  };
};

const getCustomerByIdService = async (id: string) => {
  const customer = await findById(id);
  if (!customer) {
    throw new AppError("Customer not found", 404, true);
  }
  return {
    statusCode: 200,
    message: "Customer fetched successfully",
    data: { customer },
  };
};

const searchCustomersService = async (
  userId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const result = await searchAll(userId, search, start, end, limit);
  return {
    statusCode: 200,
    message: "Customers fetched successfully",
    data: result,
  };
};

const getCustomerOrdersService = async (
  customerId: string,
  page: number,
  limit: number,
) => {
  const customer = await findById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404, true);
  }
  const start = (page - 1) * limit;
  const end = start + limit;
  const result = await findOrdersByCustomerId(customerId, start, end, limit);
  return {
    statusCode: 200,
    message: "Customer orders fetched successfully",
    data: result,
  };
};

const updateCustomerService = async (
  id: string,
  userId: string,
  data: any,
) => {
  if (data.phone) {
    const existing = await findByPhone(userId, data.phone);
    if (existing && existing.id !== id) {
      throw new AppError(
        "Customer with this phone number already exists",
        409,
        true,
      );
    }
  }
  const customer = await updateCustomer(id, data);
  return {
    statusCode: 200,
    message: "Customer updated successfully",
    data: { customer },
  };
};

const deleteCustomerService = async (id: string) => {
  await deleteById(id);
  return {
    statusCode: 200,
    message: "Customer deleted successfully",
  };
};

export {
  createCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerOrdersService,
  searchCustomersService,
  updateCustomerService,
};
