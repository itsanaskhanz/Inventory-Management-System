import type { Request, Response } from "express";
import { clearCookies, setCookies } from "../../utils/cookie.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successRes } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ILogin, IRegister, IUser, UserRole } from "./auth.interface.js";
import {
  getUsersByRoleService,
  loginService,
  profileService,
  registerService,
} from "./auth.service.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  const body: IRegister = req.body;
  const data = await registerService(body);
  successRes(res, data.message, data.statusCode, data.data);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const body: ILogin = req.body;
  const data = await loginService(body);
  setCookies(res, data.data?.token as string);
  successRes(res, data.message, data.statusCode, data.data);
});

const logout = (_req: Request, res: Response) => {
  clearCookies(res);
  successRes(res, "Logged out successfully", 200);
};

const profile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const data = await profileService(req.user as IUser);
    successRes(res, data.message, data.statusCode, data.data);
  },
);

const getUsersByRole = asyncHandler(async (req: Request, res: Response) => {
  const role = req.params.role as UserRole;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const data = await getUsersByRoleService(role, page, limit);
  successRes(res, data.message, data.statusCode, data.data);
});

export { getUsersByRole, login, logout, profile, register };
