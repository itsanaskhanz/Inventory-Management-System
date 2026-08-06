import type { PaginationMeta } from "../../utils/pagination.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import AppError from "../../utils/error.js";
import { excludePassword } from "../../utils/helpers.js";
import { signToken } from "../../utils/jwt.js";
import type { ServiceResult } from "../../utils/response.js";
import { UserRole } from "./auth.interface.js";
import type {
  ILogin,
  IRegister,
  IUpdateProfile,
  IUser,
  PublicUser,
} from "./auth.interface.js";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  listUsersByRole,
  updateUser,
} from "./auth.repository.js";

const toPublicUser = (user: { password?: string }) =>
  excludePassword(user) as PublicUser;

const registerService = async ({
  name,
  email,
  password,
}: IRegister): Promise<ServiceResult<{ user: PublicUser }>> => {
  const existing = await findUserByEmail(email);
  if (existing) throw new AppError("User already exists", 409, true);

  const user = await createUser({ name, email, password, role: UserRole.ADMIN });
  return {
    statusCode: 201,
    message: "User created successfully",
    data: { user: toPublicUser(user) },
  };
};

const loginService = async ({
  email,
  password,
}: ILogin): Promise<ServiceResult<{ user: PublicUser; token: string }>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 401, true);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401, true);

  const token = signToken({ id: user.id, role: user.role as UserRole });

  return {
    statusCode: 200,
    message: "Login successful",
    data: { user: toPublicUser(user), token },
  };
};

const profileService = async (
  user: IUser,
): Promise<ServiceResult<{ user: PublicUser }>> => {
  return {
    statusCode: 200,
    message: "Profile fetched successfully",
    data: { user: toPublicUser(user) },
  };
};

const updateProfileService = async (
  userId: string,
  { name, email, password }: IUpdateProfile,
): Promise<ServiceResult<{ user: PublicUser }>> => {
  if (email) {
    const existing = await findUserByEmail(email);
    if (existing && existing.id !== userId) {
      throw new AppError("Email already in use", 409, true);
    }
  }

  const updates: IUpdateProfile = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (password) updates.password = await hashPassword(password);

  const user = await updateUser(userId, updates);
  return {
    statusCode: 200,
    message: "Profile updated successfully",
    data: { user: toPublicUser(user) },
  };
};

const deleteAccountService = async (
  user: IUser,
): Promise<ServiceResult<null>> => {
  await deleteUser(user.id);
  return {
    statusCode: 200,
    message: "Account deleted successfully",
    data: null,
  };
};

const getUsersByRoleService = async (
  role: UserRole,
  page: number,
  limit: number,
): Promise<ServiceResult<{ users: PublicUser[]; pagination: PaginationMeta }>> => {
  if (!Object.values(UserRole).includes(role)) {
    throw new AppError("Invalid role", 400, true);
  }

  const { users, pagination } = await listUsersByRole(role, page, limit);
  return {
    statusCode: 200,
    message: `${role === UserRole.SUPER_ADMIN ? "Super Admins" : "Admins"} fetched successfully`,
    data: { users: users.map(toPublicUser), pagination },
  };
};

export {
  deleteAccountService,
  getUsersByRoleService,
  loginService,
  profileService,
  registerService,
  updateProfileService,
};
