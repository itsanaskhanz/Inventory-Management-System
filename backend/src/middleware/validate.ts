import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import AppError from "../utils/error.js";

const validate =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) =>
          issue.path.length
            ? `${issue.path.join(".")}: ${issue.message}`
            : issue.message,
        )
        .join("; ");
      next(new AppError(message, 400, true));
      return;
    }
    req.body = result.data;
    next();
  };

export default validate;
