import { uploadMiddleware } from "../middleware/multer";
import { createProduct, getAllProducts, updateProduct } from "../controllers/productController";
import { deleteProduct } from "../controllers/productController";
import { Router } from "express";


const productRouter = Router();

productRouter.post('/skapa', uploadMiddleware, createProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/produkter', getAllProducts);
productRouter.put('/:id', updateProduct);


export default productRouter;