import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    buyerEmail: String,
    status: { type: String, default: 'Pending' },
    orderId: String,
  }, { timestamps: true });
  
  export default mongoose.model('Order', orderSchema);