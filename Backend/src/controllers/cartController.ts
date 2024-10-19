import mongoose from "mongoose";
import { CustomRequest } from "../middleware/auth";
import Product from "../models/productModel"
import { Response } from "express";
import User from "../models/userModel";

export const getCartProducts = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user || !req.user.cartItems || req.user.cartItems.length === 0) {
            return res.json([]);
        }

        const productIds = req.user.cartItems.map((item) => new mongoose.Types.ObjectId(item.product));

        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = products.map((product) => {
            const cartItem = req.user?.cartItems.find((item) =>
                item.product.toString() === product._id.toString()
            );
            return { ...product.toJSON(), quantity: cartItem?.quantity };
        });

        res.json(cartItems);
    } catch (error: any) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req:CustomRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).send("Autentisering krävs.");
	  }

	  console.log('User:', req.user);
	  console.log("Request Body:", req.body);
	  
	try {
		const { productId, objectId  } = req.body;

		const cartItem = {
			_id: new mongoose.Types.ObjectId(),
			id: productId, 
			quantity: 1, 
			product: new mongoose.Types.ObjectId(objectId),
		  };

		if (!productId) {
            return res.status(400).json({ message: "Produkt-ID saknas" });
        }

		const user = await User.findById(req.user._id); 


		if (!req.user.cartItems || !Array.isArray(req.user.cartItems)) {
            req.user.cartItems = [];
        } else {
            req.user.cartItems = req.user.cartItems.filter(item => item !== null);
        }

		if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

		const existingItem = user?.cartItems.find((item) => item.product.toString() === productId);


		if (existingItem) {
			existingItem.quantity += 1;
		}else {
            req.user.cartItems.push(cartItem);
        }

		await req.user.save();
		res.json(req.user.cartItems);
	} catch (error: any) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeFromCart = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }
	console.log("Request Body:", req.body);

    try {
        const { objectId } = req.body;
        const user = req.user;

        if ( !objectId) {
            return res.status(400).json({ message: "Objekt-ID krävs för att ta bort produkten." });
        }

        console.log("Before removal:", user.cartItems);
               
        user.cartItems = user.cartItems.filter((item) => {
            console.log('Comparing:', item.product.toString(), 'with', objectId);
            return item.product.toString() !== objectId;
        });
        

        console.log("After removal:", user.cartItems);

        await user.save();

        res.json(user.cartItems);
    } catch (error: any) {
        console.log("Error in removeFromCart controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }

    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
            } else {
                existingItem.quantity = quantity;
            }

            await user.save();

            const products = await Product.find({ _id: { $in: user.cartItems.map(item => item.product) } });

            const updatedCartItems = products.map(product => {
                const cartItem = user.cartItems.find(item => item.product.toString() === product._id.toString());
                return { ...product.toJSON(), quantity: cartItem?.quantity };
            });

            return res.json(updatedCartItems);
        } else {
            return res.status(404).json({ message: "Produkt hittades inte i kundkorgen." });
        }
    } catch (error: any) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

