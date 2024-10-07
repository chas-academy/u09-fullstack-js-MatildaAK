import { IProduct } from "../interface/IProduct";
import Product from "../models/productModel";
import Image from "../models/imageModel";

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
    return await Product.findOneAndDelete({ id });
  } catch (error) {
    throw new Error("Misslyckades med att ta bort produkten");
  }
};

const fetchProducts = async (category?: string) => {
  if (category) {
    return await Product.find({ category });
  } else {
    return await Product.find({});
  }
};

// const readAll = async (req: any, res: any) => {
//   try {
//     const { category } = req.query;
//     const products = await fetchProducts(category);
//     res.status(200).json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Misslyckades med att hämta produkter" });
//   }
// };

const read = async (id: number) => {
  if (!id) {
    throw new Error("Ett giltigt ID måste anges.");
  }

  try {
    const product = await Product.findOne({id});

    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    throw new Error("Kunde inte hitta produkt");
  }
};

const update = async (id: number, data: IProduct) => {
  try {
    return await Product.findOneAndUpdate({id}, data, { new: true });
  } catch (error) {
    throw new Error("Kunde inte uppdatera produkt");
  }
};

export const createProduct = async (req: any, res: any) => {
  try {

    let base64Images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      base64Images = req.files.map((file: any) => {
        return file.buffer.toString('base64');
      });
    }
    
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

    if (!title || !price || !category) {
      return res
        .status(400)
        .json({ message: "Titel, pris och kategori är obligatoriska fält" });
    }

    const result = await create({
      id,
      title,
      category,
      image: base64Images,
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

export const getAllProducts = async (req: any, res: any) => {
  try {
    const { category } = req.query;
    const products = await fetchProducts(category);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Inga produkter hittades!" });
  }
};


export const updateProduct = async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedProductData = req.body;

    let base64Images: string[] = [];
    
    if (req.files && Array.isArray(req.files)) {
      base64Images = req.files.map((file: any) => {
        return file.buffer.toString('base64');
      });
    }

    if (base64Images.length > 0) {
      updatedProductData.image = base64Images;
    }

    const existingProduct = await read(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Produkt hittades inte" });
    }

    const updatedProduct = await update(id, updatedProductData);

    res.status(200).json({ message: "Lyckad uppdatering", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Opps! Något hände vid försök av uppdatering av produkt",
      });
  }
};
