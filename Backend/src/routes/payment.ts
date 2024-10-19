import { checkoutSuccess, createCheckoutSession } from "../controllers/paymentController";
import express from "express";
import { auth } from "../middleware/auth";


const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", auth, createCheckoutSession);
paymentRouter.post("/checkout-success", auth, checkoutSuccess);

export default paymentRouter;