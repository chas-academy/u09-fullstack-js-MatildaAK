import express, { Request, Response } from "express";
import productRouter from "./routes/product";
import userRouter from "./routes/user";

const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", productRouter);
app.use("/", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;
