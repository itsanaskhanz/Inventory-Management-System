import type { Express, Request, Response } from "express";
import express from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.get("/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});
export default app;
