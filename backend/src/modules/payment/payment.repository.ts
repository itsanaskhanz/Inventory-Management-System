import prisma from "../../config/database.js";
import { Prisma } from "../../generated/prisma/client.js";
import { buildPagination } from "../../utils/pagination.js";
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
        status: "PENDING",
      },
      orderBy: { createdAt: "asc" },
    });

    let remainingCash = data.cashReceived;

    for (const order of orders) {
      if (remainingCash <= 0) break;

      const due = order.due;
      const amountToPay = Math.min(remainingCash, due);
      const newDue = due - amountToPay;

      await tx.order.update({
        where: { id: order.id },
        data: {
          cashReceived: {
            increment: amountToPay,
          },
          due: newDue,
          status: newDue === 0 ? "COMPLETED" : "PENDING",
        },
      });

      remainingCash -= amountToPay;
    }

    return payment;
  });
};

const getPayments = async (customerId: string, page: number, limit: number) => {
  const where: Prisma.PaymentWhereInput = { customerId };
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

export { createPayment, getPayments };
