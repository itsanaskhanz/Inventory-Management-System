import {
  create,
  findAll,
  deleteById,
  findById,
  updateCustomer,
} from "./customer.repository.js";
import AppError from "../../utils/error.js";

const createCustomerService = async (data: any, userId: string) => {
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

const updateCustomerService = async (id: string, data: any) => {
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
  updateCustomerService,
};
