import { ObjectId } from "mongodb";

export interface IProduct {
    _id: ObjectId;
    category: string;
    title: string;
    image: string;
    price: number;
    author?: string;
    sort?: string;
    description: string;
    date: Date;
    available: boolean;

}