import express, { Request, Response } from 'express';
import imageRoutes from './routes/imageRoutes';

const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export default app;