import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: { type: String, enum: ['Animal', 'Animal Food', 'Animal Accessories'] },
  description: String,
  price: Number,
  image: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  country: String
}, { timestamps: true });

export default mongoose.model('Product', productSchema);