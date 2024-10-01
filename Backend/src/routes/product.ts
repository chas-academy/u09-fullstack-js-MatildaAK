import { createProduct } from "../controllers/productController";
import { Router } from "express";


const productRouter = Router();

productRouter.post('/skapa', createProduct)


export default productRouter;