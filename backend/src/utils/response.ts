import { Response } from "express";

const successRes = (
  res: Response,
  message: string,
  statusCode: number,
  data?: any,
) => {
  res
    .json({
      success: true,
      message: message,
      data: data,
    })
    .status(statusCode);
};

const errorRes = (
  res: Response,
  message: string,
  statusCode: number,
  data?: any,
) => {
  res
    .json({
      success: false,
      message: message,
      data: data,
    })
    .status(statusCode);
};
export { successRes, errorRes };
