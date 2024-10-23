import express, { Request, Response } from "express";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import paymentRouter from "./routes/payment";
import cartRouter from "./routes/cart";
import bodyParser from 'body-parser';
import orderRouter from "./routes/orders";
import fs from 'fs';


const app = express();

const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'middleware', 'uploads')));
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/betalning", paymentRouter);
app.use("/kundkorg", cartRouter);
app.use("/", orderRouter);

app.use((req, res, next) => {
  next();
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile('../../../favicon.ico')
})

app.use(express.static('public'));

app.get('/check-file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'middleware', 'uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: `Filen ${filename} finns inte.` });
    }
    res.status(200).json({ message: `Filen ${filename} finns.` });
  });
});


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;
