import type { Response } from "express";

export interface ServiceResult<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const successRes = (
  res: Response,
  message: string,
  statusCode: number,
  data?: unknown,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorRes = (
  res: Response,
  message: string,
  statusCode: number,
  data?: unknown,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};

export const sendSuccess = <T>(res: Response, result: ServiceResult<T>) => {
  successRes(res, result.message, result.statusCode, result.data);
};
