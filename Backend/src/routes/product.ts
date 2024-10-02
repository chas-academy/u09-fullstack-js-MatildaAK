import { createProduct, getAllProducts, updateProduct } from "../controllers/productController";
import { deleteProduct } from "../controllers/productController";
import { Router } from "express";


const productRouter = Router();

productRouter.post('/skapa', createProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/produkter', getAllProducts);
productRouter.put('/:id', updateProduct);


export default productRouter;