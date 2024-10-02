import { IProduct } from "../interface/IProduct";
import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema<IProduct> (
{
    id: {
        type: Number,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: false,
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
    description: {
        type: String,
        require: true,
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