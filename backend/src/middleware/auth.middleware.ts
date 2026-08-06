import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../modules/auth/auth.interface.js";
import { findUserById } from "../modules/auth/auth.repository.js";
import AppError from "../utils/error.js";
import { excludePassword } from "../utils/helpers.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new AppError("Not authenticated", 401, true);
  }

  const decoded = verifyToken(token);
  const user = await findUserById(decoded.id);
  if (!user) {
    throw new AppError("User no longer exists", 401, true);
  }

  req.user = excludePassword(user) as IUser;
  next();
};

export { authenticate };
