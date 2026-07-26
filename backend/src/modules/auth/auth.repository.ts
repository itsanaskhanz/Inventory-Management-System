import prisma from "../../config/database.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { IRegister } from "./auth.interface.js";

const findById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  return user;
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

export { findByEmail, findById, createUser };
