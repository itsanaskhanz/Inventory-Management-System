import prisma from "../../config/database.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { buildPagination } from "../../utils/pagination.js";
import { IRegister, UserRole } from "./auth.interface.js";

const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const listUsersByRole = async (role: UserRole, page: number, limit: number) => {
  const where = { role };
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  return { users, pagination: buildPagination(total, page, limit) };
};

const createUser = async ({ name, email, password, role }: IRegister) => {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
};

const updateUser = async (
  id: string,
  data: { name?: string; email?: string; password?: string },
) => {
  return prisma.user.update({ where: { id }, data });
};

const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

export {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  listUsersByRole,
  updateUser,
};
