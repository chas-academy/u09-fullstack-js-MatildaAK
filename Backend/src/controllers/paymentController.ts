import { Response } from "express";
import { CustomRequest } from "../middleware/auth";
import { stripe } from "../middleware/stripe";
import Order from "../models/orderModel";


export const createCheckoutSession = async (req:CustomRequest, res: Response) => {
    if (!req.user) {
		return res.status(401).send("Autentisering krävs.");
	  }
	try {
		const { products } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "sek",
					product_data: {
						name: product.title,
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/lyckadbetalning?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/kundkorg?canceled=true`,
			metadata: {
				userId: req.user._id.toString(),
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error: any) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req:CustomRequest, res: Response) => {
	const { sessionId } = req.body;
	
	try {

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

        if (existingOrder) {
            return res.status(200).json({ message: "Order already exists", order: existingOrder });
        }


        if (session.metadata){
            if (session.payment_status === "paid") {

                // create a new Order
                const products = JSON.parse(session.metadata.products);
                const newOrder = new Order({
                    user: session.metadata.userId,
                    products: products.map((product: { id: any; quantity: any; price: any; }) => ({
                        product: product.id,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                    stripeSessionId: sessionId,
                });
    
                await newOrder.save();
    
                res.status(200).json({
                    success: true,
                    message: "Betalning lyckad, beställning skapad.",
                    orderId: newOrder._id,
                });
            }
        } else {
            console.error("Error processing successful checkout:");
        }


	} catch (error: any) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

