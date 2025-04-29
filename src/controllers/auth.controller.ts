import { Request, Response } from "express";
import User  from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    name,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id.toString()),
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id.toString()),
  });
};
