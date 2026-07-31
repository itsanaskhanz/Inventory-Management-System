import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express, Request, Response } from "express";
import express from "express";
import env from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";

const FRONTEND_URL = env.FRONTEND_URL || "http://localhost:3000";

const CORS_OPTIONS = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
const app: Express = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.get("/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
