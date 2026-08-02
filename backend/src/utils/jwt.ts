import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { UserRole } from "../modules/auth/auth.interface.js";

interface TokenPayload {
  id: string;
  role: UserRole;
}

const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export { signToken, verifyToken };
