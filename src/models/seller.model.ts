import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    businessName: { type: String },
    password: { type: String },
    phone: { type: String },
    verified: { type: Boolean, default: false },
    address: { type: String },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
