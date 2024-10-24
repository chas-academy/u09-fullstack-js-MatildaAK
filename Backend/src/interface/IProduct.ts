export interface IProduct {
    id: number;
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