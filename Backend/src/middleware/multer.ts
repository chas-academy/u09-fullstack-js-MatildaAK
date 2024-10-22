import multer from "multer";
import path from "path";

// Multer är ett mellanprogram (middleware) för hantering av multipart/ form-data, främst för att ladda upp filer.

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    const uploadPath = path.join(__dirname, "uploads");
    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMiddleware = upload.single("image");
