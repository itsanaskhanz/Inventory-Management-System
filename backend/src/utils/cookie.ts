import type { Response } from "express";
import env from "../config/env.js";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  path?: string;
  domain?: string;
}

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  path: "/",
  //   domain: process.env.DOMAIN,
};
const setCookies = (res: Response, token: string, options?: CookieOptions) => {
  res.cookie("token", token, { ...defaultOptions, ...options });
};
const clearCookies = (res: Response, options?: CookieOptions) => {
  res.clearCookie("token", { ...defaultOptions, ...options });
};

export { setCookies, clearCookies };
