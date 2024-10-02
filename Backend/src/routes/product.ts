import { createProduct } from "../controllers/productController";
import { deleteProduct } from "../controllers/productController";
import { Router } from "express";


const productRouter = Router();

productRouter.post('/skapa', createProduct);
productRouter.delete('/:id', deleteProduct)


export default productRouter;