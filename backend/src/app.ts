import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import env from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import customerRouter from "./modules/customer/customer.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import AppError from "./utils/error.js";
import { errorRes } from "./utils/response.js";

const CORS_OPTIONS = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
const app: Express = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/customers", customerRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404, true));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    errorRes(res, error.message, error.statusCode);
    return;
  }
  console.error(error);
  errorRes(res, "Internal Server Error", 500);
});

export default app;
