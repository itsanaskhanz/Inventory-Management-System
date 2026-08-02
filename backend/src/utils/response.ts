import type { Response } from "express";

const successRes = (
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

const errorRes = (
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
export { successRes, errorRes };
