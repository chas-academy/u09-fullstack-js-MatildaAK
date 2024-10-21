import multer from "multer";

// Multer är ett mellanprogram (middleware) för hantering av multipart/ form-data, främst för att ladda upp filer.

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const uploadMiddleware = upload.array("image", 10);
