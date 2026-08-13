import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { clearCookies, setCookies } from "../../utils/cookie.js";
import { getPagination, getUserId } from "../../utils/request.js";
import { successRes } from "../../utils/response.js";
import type { UserRole } from "./auth.interface.js";
import {
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
} from "./auth.service.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerService(req.body);
  successRes(res, result.message, result.statusCode, result.data);
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await verifyEmailService(req.body);
  successRes(res, result.message, result.statusCode, result.data);
});

const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const result = await resendOTPService(req.body);
  successRes(res, result.message, result.statusCode, result.data);
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await forgotPasswordService(req.body);
  successRes(res, result.message, result.statusCode, result.data);
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await resetPasswordService(req.body);
  successRes(res, result.message, result.statusCode, result.data);
});
const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginService(req.body);
  setCookies(res, result.data.token);
  successRes(res, result.message, result.statusCode, result.data);
});

const logout = (_req: Request, res: Response) => {
  clearCookies(res);
  successRes(res, "Logged out successfully", 200, null);
};

const profile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await profileService(req.user!);
  successRes(res, result.message, result.statusCode, result.data);
});

const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await updateProfileService(getUserId(req), req.body);
  successRes(res, result.message, result.statusCode, result.data);
});

const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await deleteAccountService(req.user!);
  clearCookies(res);
  successRes(res, result.message, result.statusCode, result.data);
});

const getUsersByRole = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = getPagination(req);
  const result = await getUsersByRoleService(req.params.role as UserRole, page, limit);
  successRes(res, result.message, result.statusCode, result.data);
});

export { deleteAccount, forgotPassword, getUsersByRole, login, logout, profile, register, resendOTP, resetPassword, updateProfile, verifyEmail };
