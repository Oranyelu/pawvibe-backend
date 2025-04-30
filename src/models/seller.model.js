const mongoose = require('mongoose');

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

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
