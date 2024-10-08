import { uploadMiddleware } from "../middleware/multer";
import { createProduct, getAllProducts, updateProduct } from "../controllers/productController";
import { deleteProduct } from "../controllers/productController";
import { Router } from "express";
import { auth, admin } from "../middleware/auth";


const productRouter = Router();

productRouter.post('/skapa', auth, admin, uploadMiddleware, createProduct);
productRouter.delete('/:id', auth, admin, deleteProduct);
productRouter.get('/produkter', getAllProducts);
productRouter.put('/:id', auth, admin, uploadMiddleware,  updateProduct);


export default productRouter;