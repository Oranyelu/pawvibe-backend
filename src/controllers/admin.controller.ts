import User from "../models/user.model";
import { Request, Response } from "express";

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
