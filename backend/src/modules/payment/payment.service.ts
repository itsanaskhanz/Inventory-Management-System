import type { Payment } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { ensureOwnership } from "../../utils/ownership.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import {
  findCustomerById,
  getCustomerPaymentSummary,
} from "../customer/customer.repository.js";
import type { ICancelPayment, ICreatePayment } from "./payment.interface.js";
import {
  cancelPayment,
  createPayment,
  findPaymentById,
  getPayments,
} from "./payment.repository.js";

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

  const summary = await getCustomerPaymentSummary(customerId);
  if (data.cashReceived > summary.totalDue) {
    throw new AppError(
      `Amount received cannot be greater than the total due (${summary.totalDue})`,
      400,
      true,
    );
  }

  const payment = await createPayment(customerId, data);
  return {
    statusCode: 201,
    message: "Payment created successfully",
    data: { payment },
  };
};

const cancelPaymentService = async (
  userId: string,
  data: ICancelPayment,
): Promise<ServiceResult<{ payment: Payment }>> => {
  const existing = await findPaymentById(data.paymentId);
  if (!existing) throw new AppError("Payment not found", 404, true);
  ensureOwnership(existing.customer, userId, "customer");

  const payment = await cancelPayment(data.paymentId);
  return {
    statusCode: 200,
    message: "Payment cancelled successfully",
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

export { cancelPaymentService, createPaymentService, getPaymentsService };
