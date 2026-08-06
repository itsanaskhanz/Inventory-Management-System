import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { clearCookies, setCookies } from "../../utils/cookie.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { getPagination, getUserId } from "../../utils/request.js";
import { sendSuccess } from "../../utils/response.js";
import type { UserRole } from "./auth.interface.js";
import {
  deleteAccountService,
  getUsersByRoleService,
  loginService,
  profileService,
  registerService,
  updateProfileService,
} from "./auth.service.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await registerService(req.body));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginService(req.body);
  setCookies(res, result.data.token);
  sendSuccess(res, result);
});

const logout = (_req: Request, res: Response) => {
  clearCookies(res);
  sendSuccess(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
};

const profile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  sendSuccess(res, await profileService(req.user!));
});

const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await updateProfileService(getUserId(req), req.body));
  },
);

const deleteAccount = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteAccountService(req.user!);
    clearCookies(res);
    sendSuccess(res, result);
  },
);

const getUsersByRole = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = getPagination(req);
  sendSuccess(
    res,
    await getUsersByRoleService(req.params.role as UserRole, page, limit),
  );
});

export {
  deleteAccount,
  getUsersByRole,
  login,
  logout,
  profile,
  register,
  updateProfile,
};
