import mongoose from "mongoose";
import { CustomRequest } from "../middleware/auth";
import Product from "../models/productModel"
import { Response } from "express";
import User from "../models/userModel";

export const getCartProducts = async (req: CustomRequest, res: Response) => {
    try {
        // Kontrollera att användaren har produkter i kundkorgen
        if (!req.user || !req.user.cartItems || req.user.cartItems.length === 0) {
            return res.json([]); // Returnera en tom array om kundkorgen är tom
        }

        // Hämta produkternas ObjectId från användarens kundkorg
        const productIds = req.user.cartItems.map((item) => new mongoose.Types.ObjectId(item.product));

        // Hämta produkterna från databasen
        const products = await Product.find({ _id: { $in: productIds } });

        // Lägg till kvantitet för varje produkt baserat på användarens kundkorg
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

// export const removeAllFromCart = async (req:CustomRequest, res: Response) => {
// 	if (!req.user) {
// 		return res.status(401).send("Autentisering krävs.");
// 	  }
// 	try {
// 		const { productId } = req.body;
// 		const user = req.user;
// 		if (!productId) {
// 			user.cartItems = [];
// 		} else {
// 			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
			
// 		}
// 		await user.save();
// 		res.json(user.cartItems);
// 	} catch (error: any) {
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };


export const removeFromCart = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).send("Autentisering krävs.");
    }
	console.log("Request Body:", req.body);

    try {
        const { objectId } = req.body;  // Ta emot både productId och objectId
        const user = req.user;

        // Kontrollera om productId och objectId skickades
        if ( !objectId) {
            return res.status(400).json({ message: "Objekt-ID krävs för att ta bort produkten." });
        }

        console.log("Before removal:", user.cartItems);
        
        // Filtrera bort produkten med det specifika produkt-ID:t
        // user.cartItems = user.cartItems.filter((item) => item._id.toString() !== objectId);
        
        user.cartItems = user.cartItems.filter((item) => {
            console.log('Comparing:', item.product.toString(), 'with', objectId);
            return item.product.toString() !== objectId;
        });
        

        console.log("After removal:", user.cartItems);

        // Spara den uppdaterade användardatan
        await user.save();

        // Skicka tillbaka den uppdaterade kundkorgen
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

        // Hitta produkten i kundkorgen
        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

        if (existingItem) {
            if (quantity === 0) {
                // Ta bort produkten om kvantiteten är 0
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
            } else {
                // Uppdatera kvantiteten
                existingItem.quantity = quantity;
            }

            // Spara uppdaterad användardata
            await user.save();

            // Hämta uppdaterade produkter från databasen
            const products = await Product.find({ _id: { $in: user.cartItems.map(item => item.product) } });

            // Kombinera produktinformation och kvantitet
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

