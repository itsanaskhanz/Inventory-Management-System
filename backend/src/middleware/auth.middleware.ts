import type { NextFunction, Response } from "express";
import { findById } from "../modules/auth/auth.repository.js";
import AppError from "../utils/error.js";
import { excludePassword } from "../utils/helpers.js";
import { verifyToken } from "../utils/jwt.js";
import { errorRes } from "../utils/response.js";
const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      throw new AppError("Not authenticated", 401, true);
    }
    const decoded = verifyToken(token);
    const user = await findById(decoded?.id);
    req.user = excludePassword(user);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      errorRes(res, error.message, error.statusCode, null);
    } else {
      errorRes(res, "Internal Server Error", 500);
    }
  }
};
export { authenticate };
