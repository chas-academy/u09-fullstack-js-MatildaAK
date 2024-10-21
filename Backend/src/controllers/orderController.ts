import { CustomRequest } from "../middleware/auth";
import { stripe } from "../middleware/stripe";
import { Response } from "express";

export const getOrderDetails = async (req: CustomRequest, res: Response) => {
    const sessionId = req.params.sessionId;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
      });
  
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
  
      const orderNumber = session.id;
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
      const orderDate = new Date(session.created * 1000); 
      const lineItems = session.line_items?.data.map((item) => ({
          productName: item.description || "Unknown product", 
          quantity: item.quantity || 1,
          unitPrice: item.price?.unit_amount 
            ? item.price.unit_amount / 100 
            : 0, 
        })) || [];
  
      const orderDetails = {
        orderNumber,
        totalAmount,
        orderDate,
        lineItems,
      };
  
      res.status(200).json(orderDetails);
  
    } catch (error) {
      console.error('Error retrieving order details:', error);
      res.status(500).json({ message: 'Error retrieving order details' });
    }
  };