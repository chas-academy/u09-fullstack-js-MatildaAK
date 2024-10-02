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

const deleteOne = async (id: number) => {
  try {
    return await Product.findOneAndDelete({id});
  } catch (error) {
    throw new Error("Misslyckades med att ta bort produkten");
  }
};

export const createProduct = async (req: any, res: any) => {
  try {
    let lastProduct = await Product.findOne({}).sort({ id: -1 });

    let id = lastProduct ? lastProduct.id + 1 : 1;

    const {
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
    
      const result = await create({
        id,
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

export const deleteProduct = async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);

    const deleteProduct = await deleteOne(id);

    if (!deleteProduct) {
      return res.status(400).json({ message: "Hittade inte produkt" });
    }

    res.status(200).json({ message: "Produkt borttagen!", deleteProduct });
  } catch (error) {
    res.status(500).json({
      message: "Opps! Något hände vid försök av borttag av produkt",
    });
  }
};
