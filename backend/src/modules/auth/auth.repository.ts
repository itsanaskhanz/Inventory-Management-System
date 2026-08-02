import prisma from "../../config/database.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { IRegister, UserRole } from "./auth.interface.js";

const findById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  return user;
};
const findByRole = async (
  role: UserRole,
  start: number,
  end: number,
  limit: number,
) => {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: role },
      skip: start,
      take: limit,
    }),
    prisma.user.count({ where: { role: role } }),
  ]);

  return {
    users,
    pagination: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: end < total,
      hasPreviousPage: start > 0,
    },
  };
};

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};
const createUser = async ({ name, email, password, role }: IRegister) => {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
  return user;
};

export { createUser, findByEmail, findById, findByRole };
