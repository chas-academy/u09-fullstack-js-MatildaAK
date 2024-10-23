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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }

    try {
        const { productId, objectId } = req.body;

        if (!productId || !objectId) {
            return res.status(400).json({ message: "Produkt-ID eller objekt-ID saknas" });
        }

        if (!mongoose.Types.ObjectId.isValid(objectId)) {
            return res.status(400).json({ message: "Invalid object ID" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Användare inte hittad" });
        }

        if (!user.cartItems || !Array.isArray(user.cartItems)) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item !== null);
        }

        const existingItem = user.cartItems.find((item) => item.product.toString() === objectId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const cartItem = {
                _id: new mongoose.Types.ObjectId(),
                id: productId,
                quantity: 1,
                product: new mongoose.Types.ObjectId(objectId), 
            };
            user.cartItems.push(cartItem);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeFromCart = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }

    try {
        const { objectId } = req.body;
        const user = req.user;

        if ( !objectId) {
            return res.status(400).json({ message: "Objekt-ID krävs för att ta bort produkten." });
        }


               
        user.cartItems = user.cartItems.filter((item) => {
            return item.product.toString() !== objectId;
        });

        await user.save();

        res.json(user.cartItems);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeAllFromCart = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }

    try {
        const user = req.user;
        
        user.cartItems = [];
        
        await user.save();

        res.json(user.cartItems);
    } catch (error: any) {
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

