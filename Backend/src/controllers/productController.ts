import { IProduct } from "../interface/IProduct";
import Product from "../models/productModel";

const create = async (data: IProduct) => {
  try {
    const product = new Product(data);
    const savedProduct = await product.save();
    return savedProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Misslyckades med att skapa produkten");
  }
};

export const createProduct = async (req: any, res: any) => {
  const {
    _id,
    title,
    category,
    price,
    author,
    sort,
    description,
    available,
    date,
  } = req.body;
  const image = req.file;

  if (!title || !price || !category) {
    return res
      .status(400)
      .json({ message: "Titel, pris och kategori är obligatoriska fält" });
  }

  try {
    const result = await create({
      _id,
      title,
      category,
      image: image?.path,
      price,
      author,
      sort,
      description,
      date,
      available,
    });

    res.status(201).json({ message: "Produkt tillagd", product: result });
  } catch (error) {
    res.status(500).json({ message: "Misslyckades med att skapa produkten" });
  }
};
