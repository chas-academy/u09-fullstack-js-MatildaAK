import { IProduct } from "interface/IProduct";
import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema<IProduct> (
{
    title: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    author: {
        type: String,
        require: false,
    },
    sort: {
        type: String,
        require: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Product = model<IProduct>("Product", productSchema)

export default Product;