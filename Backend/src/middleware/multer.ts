import multer from "multer";

// Multer är ett mellanprogram (middleware) för hantering av multipart/ form-data, främst för att ladda upp filer.

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage });

export default upload;
