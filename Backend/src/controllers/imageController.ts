import { Request, Response } from 'express';
import Image from '../models/imageModel';

const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'Ingen fil laddades upp' });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');

    const newImage = new Image({
      imageName: req.file.originalname,
      imageData: base64Image,
    });

    await newImage.save(); 

    res.status(200).json({ success: 1, message: 'Bilden har laddats upp!' });
  } catch (err: unknown) { 
    if (err instanceof Error) { 
      res.status(500).json({ success: 0, message: 'Misslyckades med att ladda upp bilder.', error: err.message });
    } else {
      res.status(500).json({ success: 0, message: 'Misslyckades med att ladda upp bilder.', error: 'Okänt fel' });
    }
  }
};

export default uploadImage;
