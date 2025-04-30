const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  buyerEmail: String,
  status: { type: String, default: 'Pending' },
  orderId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
