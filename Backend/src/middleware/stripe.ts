import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined in the environment variables");
}

export const stripe = new Stripe(stripeSecretKey);