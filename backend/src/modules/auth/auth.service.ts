import { comparePassword } from "../../utils/bcrypt.js";
import AppError from "../../utils/error.js";
import { excludePassword } from "../../utils/helpers.js";
import { signToken } from "../../utils/jwt.js";
import { ILogin, IRegister, IUser, UserRole } from "./auth.interface.js";
import { createUser, findByEmail, findByRole } from "./auth.repository.js";

const registerService = async ({ name, email, password }: IRegister) => {
  const exists = await findByEmail(email);
  if (exists) throw new AppError("User already exists", 409, true);

  const user = await createUser({ name, email, password, role: UserRole.ADMIN });
  return {
    statusCode: 201,
    message: "User created successfully",
    data: { user: excludePassword(user) },
  };
};

const loginService = async ({ email, password }: ILogin) => {
  const user = await findByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 401, true);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401, true);

  const token = signToken({ id: user.id, role: user.role as UserRole });

  return {
    statusCode: 200,
    message: "Login successful",
    data: {
      user: excludePassword(user),
      token,
    },
  };
};

const profileService = async (user: IUser) => {
  return {
    statusCode: 200,
    message: "Profile fetched successfully",
    data: {
      user: excludePassword(user),
    },
  };
};

const getUsersByRoleService = async (
  role: UserRole,
  page: number,
  limit: number,
) => {
  if (!Object.values(UserRole).includes(role)) {
    throw new AppError("Invalid role", 400, true);
  }
  const start = (page - 1) * limit;
  const end = start + limit;
  const { users, pagination } = await findByRole(role, start, end, limit);
  return {
    statusCode: 200,
    message: `${role === UserRole.SUPER_ADMIN ? "Super Admins" : "Admins"} fetched successfully`,
    data: {
      users: users.map((user) => excludePassword(user)),
      pagination,
    },
  };
};
export { getUsersByRoleService, loginService, profileService, registerService };
