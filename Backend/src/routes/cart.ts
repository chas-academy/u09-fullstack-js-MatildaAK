import { addToCart, getCartProducts, removeFromCart, updateQuantity } from "../controllers/cartController";
import { Router } from "express";
import { auth } from "../middleware/auth";


const cartRouter = Router();

cartRouter.get("/checkout", auth, getCartProducts);
cartRouter.post("/", auth, addToCart);
cartRouter.delete("/remove", auth, removeFromCart);
cartRouter.put("/:id", auth, updateQuantity);

export default cartRouter;