import type { Request, Response } from "express";
import AppError from "../../utils/error.js";
import { errorRes, successRes } from "../../utils/response.js";
import { ILogin, IRegister } from "./auth.interface.js";
import {
  loginService,
  profileService,
  registerService,
} from "./auth.service.js";
import { clearCookies, setCookies } from "../../utils/cookie.js";

const register = async (req: Request, res: Response) => {
  try {
    const body: IRegister = req.body;
    const data = await registerService(body);
    successRes(res, data.message, 200, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const body: ILogin = req.body;
    const data = await loginService(body);
    setCookies(res, data?.data?.token);
    successRes(res, data.message, 200, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};

const logout = (req: Request, res: Response) => {
  try {
    clearCookies(res);
    successRes(res, "Logged out successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
const profile = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const data = await profileService(user);
    successRes(res, data.message, data.statusCode, data.data);
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};

export { register, login, logout, profile };
