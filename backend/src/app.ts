import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express, Request, Response } from "express";
import express from "express";
import env from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import customerRouter from "./modules/customer/customer.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
