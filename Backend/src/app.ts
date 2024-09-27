import express, { Request, Response } from 'express';

const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

export default app;