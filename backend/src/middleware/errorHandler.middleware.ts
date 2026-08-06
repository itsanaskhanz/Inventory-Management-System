import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.js";
import { errorRes } from "../utils/response.js";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    errorRes(res, error.message, error.statusCode);
    return;
  }

  console.error(error);
  errorRes(res, "Internal Server Error", 500);
};
