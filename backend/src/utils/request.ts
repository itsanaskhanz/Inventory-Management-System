import type { Request } from "express";
import AppError from "./error.js";

interface RequestWithUser extends Request {
  user?: { id: string };
}

export const getUserId = (req: Request): string => {
  const user = (req as RequestWithUser).user;
  if (!user) {
    throw new AppError("Not authenticated", 401, true);
  }
  return user.id;
};

export const getRouteId = (req: Request): string => {
  const id = req.params.id;
  if (Array.isArray(id)) {
    throw new TypeError("Route parameter must be a string");
  }
  return id;
};

export const getPagination = (req: Request) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  return { page, limit };
};

export const getStringParam = (
  req: Request,
  key: string,
): string | undefined => {
  const value = req.query[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const getBooleanParam = (
  req: Request,
  key: string,
): boolean | undefined => {
  const value = req.query[key];
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const getSearchParam = (req: Request): string | undefined =>
  getStringParam(req, "search");
