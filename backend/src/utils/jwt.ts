import jwt from "jsonwebtoken";
import env from "../config/env.js";

const signToken = (payload: any) => {
  const token = jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
};
const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET as string);
};

export { signToken, verifyToken };
