import { getOrderDetails } from "../controllers/orderController";
import { Router } from "express";
import { auth } from "../middleware/auth";

const orderRouter = Router();

orderRouter.get("/order/:id", auth, getOrderDetails);

export default orderRouter;