import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Seller } from "../models/seller.model";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const seller = await Seller.findById(decoded.id).select("-password");
      if (!seller) return res.status(401).json({ message: "Not authorized" });

      (req as any).seller = seller;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
