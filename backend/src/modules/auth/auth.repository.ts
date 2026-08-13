import prisma from "../../config/database.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { generateOTP } from "../../utils/otp.js";
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
  const { OTP, expirationTime } = generateOTP();
  return prisma.user.create({
    data: { name, email, password: hashedPassword, role, isVerified: false, otpCode: OTP, otpExpiry: expirationTime },
  });
};

const updateUser = async (id: string, data: Partial<IRegister>) => {
  return prisma.user.update({ where: { id }, data });
};

const updateOTP = async (id: string, otpCode: string, otpExpiry: Date) => {
  return prisma.user.update({ where: { id }, data: { otpCode, otpExpiry } });
};

const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

export { createUser, deleteUser, findUserByEmail, findUserById, listUsersByRole, updateOTP, updateUser };
