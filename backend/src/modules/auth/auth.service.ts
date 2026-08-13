import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import AppError from "../../utils/error.js";
import { excludePassword } from "../../utils/helpers.js";
import { signToken } from "../../utils/jwt.js";
import { generateOTP, verifyOTP } from "../../utils/otp.js";
import type { PaginationMeta } from "../../utils/pagination.js";
import type { ServiceResult } from "../../utils/response.js";
import { accountDeletedEmail, loginAlertEmail, passwordResetEmail, resendVerificationEmail, verificationEmail, welcomeEmail } from "../../utils/emailTemplates.js";
import { sendEmail } from "../../utils/sendEmail.js";
import type { IForgotPassword, ILogin, IRegister, IResetPassword, IResendOTP, IUpdateProfile, IUser, IVerifyEmail, PublicUser } from "./auth.interface.js";
import { UserRole } from "./auth.interface.js";
import { createUser, deleteUser, findUserByEmail, listUsersByRole, updateOTP, updateUser } from "./auth.repository.js";

const toPublicUser = (user: { password?: string }) => excludePassword(user) as PublicUser;

const registerService = async ({ name, email, password }: IRegister): Promise<ServiceResult<{ user: PublicUser }>> => {
  const existing = await findUserByEmail(email);
  if (existing) throw new AppError("User already exists", 409, true);

  const user = await createUser({ name, email, password, role: UserRole.ADMIN });
  const { subject, html, text } = verificationEmail(user.name, user.otpCode ?? "", 15);
  await sendEmail(user.email, subject, text, html);
  return {
    statusCode: 201,
    message: "User created successfully. Please verify your email.",
    data: { user: toPublicUser(user) },
  };
};
const verifyEmailService = async ({ email, otpCode }: IVerifyEmail): Promise<ServiceResult<null>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("No account found with this email", 401, true);
  if (user.isVerified) throw new AppError("Email already verified", 400, true);
  if (!user.otpCode || !user.otpExpiry) throw new AppError("No verification code found. Please request a new one.", 400, true);
  const isValid = verifyOTP(otpCode, user.otpCode, user.otpExpiry);
  if (!isValid) throw new AppError("Invalid or expired verification code", 400, true);
  await updateUser(user.id, { isVerified: true, otpCode: null, otpExpiry: null });
  const { subject, html, text } = welcomeEmail(user.name);
  await sendEmail(user.email, subject, text, html);
  return {
    statusCode: 200,
    message: "Email verified successfully",
    data: null,
  };
};
const resendOTPService = async ({ email }: IResendOTP): Promise<ServiceResult<null>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("No account found with this email", 401, true);
  if (user.isVerified) throw new AppError("Email already verified", 400, true);

  const { OTP, expirationTime } = generateOTP();
  await updateOTP(user.id, OTP, expirationTime);
  const { subject, html, text } = resendVerificationEmail(user.name, OTP, 15);
  await sendEmail(user.email, subject, text, html);
  return {
    statusCode: 200,
    message: "Verification code sent successfully",
    data: null,
  };
};

const forgotPasswordService = async ({ email }: IForgotPassword): Promise<ServiceResult<null>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("No account found with this email", 404, true);

  const { OTP, expirationTime } = generateOTP();
  await updateOTP(user.id, OTP, expirationTime);
  const { subject, html, text } = passwordResetEmail(user.name, OTP, 15);
  await sendEmail(user.email, subject, text, html);
  return {
    statusCode: 200,
    message: "Password reset code sent successfully",
    data: null,
  };
};

const resetPasswordService = async ({ email, otpCode, password }: IResetPassword): Promise<ServiceResult<null>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("No account found with this email", 404, true);
  if (!user.otpCode || !user.otpExpiry) throw new AppError("No reset code found. Please request a new one.", 400, true);

  const isValid = verifyOTP(otpCode, user.otpCode, user.otpExpiry);
  if (!isValid) throw new AppError("Invalid or expired reset code", 400, true);

  const hashedPassword = await hashPassword(password);
  await updateUser(user.id, { password: hashedPassword, otpCode: null, otpExpiry: null });
  return {
    statusCode: 200,
    message: "Password reset successfully. Please sign in.",
    data: null,
  };
};
const loginService = async (
  { email, password }: ILogin,
  context?: { ip: string; device: string },
): Promise<ServiceResult<{ user: PublicUser; token: string }>> => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 401, true);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401, true);
  if (!user.isVerified) throw new AppError("Email not verified", 401, true);

  const token = signToken({ id: user.id, role: user.role as UserRole });

  if (context) {
    const { subject, html, text } = loginAlertEmail(user.name, context.ip, context.device);
    await sendEmail(user.email, subject, text, html);
  }

  return {
    statusCode: 200,
    message: "Login successful",
    data: { user: toPublicUser(user), token },
  };
};

const profileService = async (user: IUser): Promise<ServiceResult<{ user: PublicUser }>> => {
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

const deleteAccountService = async (user: IUser): Promise<ServiceResult<null>> => {
  const { subject, html, text } = accountDeletedEmail(user.name);
  await sendEmail(user.email, subject, text, html);
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
  forgotPasswordService,
  getUsersByRoleService,
  loginService,
  profileService,
  registerService,
  resendOTPService,
  resetPasswordService,
  updateProfileService,
  verifyEmailService,
};
