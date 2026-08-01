import { comparePassword } from "../../utils/bcrypt.js";
import AppError from "../../utils/error.js";
import { excludePassword } from "../../utils/helpers.js";
import { signToken } from "../../utils/jwt.js";
import { ILogin, IRegister, IUser, UserRole } from "./auth.interface.js";
import { createUser, findByEmail, findByRole } from "./auth.repository.js";

const registerService = async ({ name, email, password, role }: IRegister) => {
  const exists = await findByEmail(email);
  if (exists) throw new AppError("User already exists", 400, true);
  const user = await createUser({ name, email, password, role });
  return { message: "User created successfully", data: null };
};
const loginService = async ({ email, password }: ILogin) => {
  const user = await findByEmail(email);
  if (!user) throw new AppError("User not found", 400, true);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 400, true);
  const token = signToken({ id: user.id, role: user.role as UserRole });

  return {
    message: "Login successfull",
    data: {
      user: excludePassword(user),
      token: token,
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

const getAdminsService = async () => {
  const admins = await findByRole(UserRole.ADMIN);
  return {
    statusCode: 200,
    message: "Admins fetched successfully",
    data: {
      admins: admins.map((admin) => excludePassword(admin)),
    },
  };
};
export { getAdminsService, loginService, profileService, registerService };
