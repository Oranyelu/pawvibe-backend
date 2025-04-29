import { Request, Response } from "express";
import { Product } from "../models/product.model";

export const createProduct = async (req: Request, res: Response) => {
  const seller = (req as any).seller;

  const { name, description, category, price, images, location, breed, age } = req.body;

  const product = await Product.create({
    seller: seller._id,
    name,
    description,
    category,
    price,
    images,
    location,
    breed,
    age,
  });

  res.status(201).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { category, keyword } = req.query;

  const query: any = {};
  if (category) query.category = category;
  if (keyword)
    query.name = { $regex: keyword as string, $options: "i" };

  const products = await Product.find(query).populate("seller", "businessName email");
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("seller", "businessName");
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const seller = (req as any).seller;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.seller.toString() !== seller._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const seller = (req as any).seller;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.seller.toString() !== seller._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};
