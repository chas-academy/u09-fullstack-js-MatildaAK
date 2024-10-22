import { IProduct } from "../interface/IProduct";
import Product from "../models/productModel";
import Image from "../models/imageModel";
import { CustomRequest } from "middleware/auth";
import { Response } from "express";

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
    let filePath: string;

    if (req.file) {
      filePath = `${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Ingen bild har laddats upp" });
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
      image: filePath, 
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

export const getAllProducts = async (req: CustomRequest, res: Response) => {
  try {
    const { category } = req.query;

    let categoryValue: string | undefined;

    if (Array.isArray(category)) {
      categoryValue = category[0] as string;
    } else if (typeof category === 'string') {
      categoryValue = category;
    }

    const products = await fetchProducts(categoryValue);

    const productsWithImageUrls = products.map((product) => {
      console.log("Produktens bildnamn:", product.image);
      return {
        ...product,
        image: Array.isArray(product.image) && product.image.length > 0 
          ? `http://localhost:4000/uploads/${product.image[0]}` 
          : '', 
      };
    });
    
    console.log("Hämtade kategorier:", products.map(product => product.category));


    console.log("Produkter med bildvägar:", productsWithImageUrls);

    res.status(200).json({ success: true, products: productsWithImageUrls });
  } catch (error) {
    res.status(500).json({ message: "Inga produkter hittades!" });
  }
};

export const updateProduct = async (req: CustomRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existingProduct = await read(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Produkt hittades inte" });
    }

    const updatedProductData = { ...req.body };
    let filePath: string | undefined;

    if (req.file) {
      filePath = req.file.filename;
      updatedProductData.image = filePath;
    } 

    if (!updatedProductData.title || !updatedProductData.price || !updatedProductData.category) {
      return res.status(400).json({ message: "Titel, pris och kategori är obligatoriska fält" });
    }

    const updatedProduct = await update(id, updatedProductData);

    res.status(200).json({ message: "Lyckad uppdatering", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Opps! Något hände vid försök av uppdatering av produkt",
    });
  }
};


export const newCollections = async (req: any, res: any) => {
  try {

    const products = await Product.find({}).sort({ id: -1 }).limit(9);
    
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "Inga produkter hittades!" });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Fel vid hämtning av produkter:", error);
    res.status(500).json({ message: "Inga produkter hittades!" });
  }
};
export const popularProducts = async (req: any, res: any) => {
  try {

    const products = await Product.find({ category: "book"}).sort({ id: -1 }).limit(4);
    
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "Inga produkter hittades!" });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Fel vid hämtning av produkter:", error);
    res.status(500).json({ message: "Inga produkter hittades!" });
  }
};

