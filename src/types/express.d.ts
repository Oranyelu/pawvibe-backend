import { Seller } from "../models/seller.model";

declare global {
  namespace Express {
    interface Request {
      seller?: Seller;
    }
  }
}
