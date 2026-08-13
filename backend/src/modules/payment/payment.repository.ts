import prisma from "../../config/database.js";
import { PaymentStatus, Prisma } from "../../generated/prisma/client.js";
import AppError from "../../utils/error.js";
import { buildPagination } from "../../utils/pagination.js";
import { OrderStatus, getOrderPaymentStatus } from "../order/order.interface.js";
import type { ICreatePayment } from "./payment.interface.js";

const createPayment = async (customerId: string, data: ICreatePayment) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        customerId,
        cashReceived: data.cashReceived,
        note: data.note,
      },
    });

    const orders = await tx.order.findMany({
      where: {
        customerId,
        status: OrderStatus.PENDING,
      },
      orderBy: { createdAt: "asc" },
    });

    let remainingCash = data.cashReceived;

    for (const order of orders) {
      if (remainingCash <= 0) break;

      const due = order.due;
      if (due <= 0) continue;

      const amountToPay = Math.min(remainingCash, due);
      const newCashReceived = order.cashReceived + amountToPay;
      const newDue = due - amountToPay;

      await tx.order.update({
        where: { id: order.id },
        data: {
          cashReceived: {
            increment: amountToPay,
          },
          due: newDue,
          status: getOrderPaymentStatus(order.total, newCashReceived),
        },
      });

      await tx.paymentOrder.create({
        data: {
          paymentId: payment.id,
          orderId: order.id,
          amount: amountToPay,
        },
      });

      remainingCash -= amountToPay;
    }

    return payment;
  });
};

const getPayments = async (
  customerId: string,
  search: string | undefined,
  page: number,
  limit: number,
) => {
  const where: Prisma.PaymentWhereInput = { customerId };
  if (search) {
    where.id = { contains: search, mode: "insensitive" };
  }
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.count({ where }),
  ]);
  return { payments, pagination: buildPagination(total, page, limit) };
};

const findPaymentById = async (id: string) => {
  return prisma.payment.findUnique({
    where: { id },
    include: { customer: true },
  });
};

const cancelPayment = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id } });
    if (!payment) throw new AppError("Payment not found", 404, true);
    if (payment.status === PaymentStatus.CANCELLED) {
      throw new AppError("Payment is already cancelled", 400, true);
    }

    const links = await tx.paymentOrder.findMany({
      where: { paymentId: id },
    });

    await tx.paymentOrder.deleteMany({ where: { paymentId: id } });

    const orderIds = [...new Set(links.map((link) => link.orderId))];
    for (const orderId of orderIds) {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order || order.status.toUpperCase() === OrderStatus.CANCELLED) continue;

      const { _sum } = await tx.paymentOrder.aggregate({
        where: { orderId },
        _sum: { amount: true },
      });
      const newCashReceived = _sum.amount ?? 0;
      const newDue = Math.max(0, order.total - newCashReceived);
      const newStatus = getOrderPaymentStatus(order.total, newCashReceived);

      await tx.order.update({
        where: { id: orderId },
        data: {
          cashReceived: newCashReceived,
          due: newDue,
          status: newStatus,
        },
      });
    }

    return tx.payment.update({
      where: { id },
      data: { status: PaymentStatus.CANCELLED },
    });
  });
};

const adjustPaymentsForCancelledOrder = async (
  tx: Prisma.TransactionClient,
  orderId: string,
) => {
  const links = await tx.paymentOrder.findMany({ where: { orderId } });
  if (links.length === 0) return;

  for (const link of links) {
    const payment = await tx.payment.findUnique({
      where: { id: link.paymentId },
    });
    if (!payment) continue;

    const newReceived = Math.max(0, payment.cashReceived - link.amount);
    if (newReceived === 0) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          cashReceived: 0,
          status: PaymentStatus.CANCELLED,
        },
      });
    } else {
      await tx.payment.update({
        where: { id: payment.id },
        data: { cashReceived: newReceived },
      });
    }
  }

  await tx.paymentOrder.deleteMany({ where: { orderId } });
};

export {
  adjustPaymentsForCancelledOrder,
  cancelPayment,
  createPayment,
  findPaymentById,
  getPayments,
};
