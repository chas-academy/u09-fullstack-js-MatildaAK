import express, { Request, Response } from "express";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import paymentRouter from "./routes/payment";
import cartRouter from "./routes/cart";
import bodyParser from 'body-parser';
import orderRouter from "./routes/orders";


const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));

app.use("/", productRouter);
app.use("/", userRouter);
app.use("/betalning", paymentRouter);
app.use("/kundkorg", cartRouter);
app.use("/", orderRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;
