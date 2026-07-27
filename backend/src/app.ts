import type { Express, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
import productRouter from "./modules/product/product.routes.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.get("/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
