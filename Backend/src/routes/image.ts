// import { Router } from 'express';
// import upload from '../middleware/multer';
// import Image from '../models/imageModel';


// const router = Router();


// router.post('/upload', upload.array('produkter', 10), async (req, res) => {
//   if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//     return res.status(400).json({ success: 0, message: 'Inga filer laddades upp.' });
//   }

//   try {
//     const imageUrls = await Promise.all(req.files.map(async (file) => {
//       const base64Image = file.buffer.toString('base64');

//       const newImage = new Image({
//         imageName: file.originalname,
//         imageData: base64Image,
//       });

//       await newImage.save();

//       return base64Image;
//     }));

//     res.json({
//       success: 1,
//       images: imageUrls 
//     });
//   } catch (err: unknown) {
//     if (err instanceof Error) { 
//         res.status(500).json({ success: 0, message: 'Misslyckades med att ladda upp bilder.', error: err.message });
//       } else {
//         res.status(500).json({ success: 0, message: 'Misslyckades med att ladda upp bilder.', error: 'Okänt fel' });
//       }
//   }
// });

// export default router;
