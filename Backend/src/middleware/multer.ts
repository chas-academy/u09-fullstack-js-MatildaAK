import multer from "multer";
import path from "path";

// Multer är ett mellanprogram (middleware) för hantering av multipart/ form-data, främst för att ladda upp filer.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Definierar din uppladdnings directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Definiera filnamn
  },
});

const upload = multer({ storage: storage });

export default upload;
