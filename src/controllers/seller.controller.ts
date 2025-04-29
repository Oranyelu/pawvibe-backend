import { Request, Response } from "express";
import { Seller } from "../models/seller.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const registerSeller = async (req: Request, res: Response) => {
  const { email, password, businessName, phone, address } = req.body;

  const exists = await Seller.findOne({ email });
  if (exists) return res.status(400).json({ message: "Seller already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const seller = await Seller.create({
    email,
    businessName,
    password: hashedPassword,
    phone,
    address,
  });

  res.status(201).json({
    _id: seller._id,
    email: seller.email,
    token: generateToken(seller._id.toString()),
  });
};

export const loginSeller = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const seller = await Seller.findOne({ email });
  if (!seller) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, seller.password!);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: seller._id,
    email: seller.email,
    token: generateToken(seller._id.toString()),
  });
};
