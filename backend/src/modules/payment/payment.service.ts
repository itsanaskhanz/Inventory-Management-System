import type { Payment } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import { findCustomerById } from "../customer/customer.repository.js";
import type { ICreatePayment } from "./payment.interface.js";
import { createPayment, getPayments } from "./payment.repository.js";

const ensureCustomerOwnership = async (customerId: string, userId: string) => {
  const customer = await findCustomerById(customerId);
  if (!customer) throw new AppError("Customer not found", 404, true);
  ensureOwnership(customer, userId, "customer");
};

const createPaymentService = async (
  customerId: string,
  userId: string,
  data: ICreatePayment,
): Promise<ServiceResult<{ payment: Payment }>> => {
  await ensureCustomerOwnership(customerId, userId);

  const payment = await createPayment(customerId, data);
  return {
    statusCode: 201,
    message: "Payment created successfully",
    data: { payment },
  };
};

const getPaymentsService = async (
  customerId: string,
  userId: string,
  page: number,
  limit: number,
): Promise<
  ServiceResult<{ payments: Payment[]; pagination: PaginationMeta }>
> => {
  await ensureCustomerOwnership(customerId, userId);

  const result = await getPayments(customerId, page, limit);
  return {
    statusCode: 200,
    message: "Payments fetched successfully",
    data: result,
  };
};

export { createPaymentService, getPaymentsService };
