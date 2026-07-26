import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface TokenPayload {
  id: string;
  email: string;
}
const signToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
};
const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET as string) as TokenPayload;
};

export { signToken, verifyToken };
