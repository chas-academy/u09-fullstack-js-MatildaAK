import express, { Request, Response } from 'express';
import upload from './middleware/multer';

const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/upload", upload.array('products', 10), (req, res) => {
    // Kontrollera att req.files existerar och är en array
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ success: 0, message: 'Inga filer laddades upp.' });
    }
  
    // Skapa en array av fil-URL:er
    const imageUrls = req.files.map(file => {
      return `/bilder/${file.filename}`;
    });
  
    res.json({
      success: 1,
      images: imageUrls  // Returnera en lista med URL:er till de uppladdade bilderna
    });
  });
  

app.use('/bilder', express.static(path.join(__dirname, '../uploads')));



export default app;