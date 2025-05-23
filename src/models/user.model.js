const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isSeller: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  photo: String,
  address: String,
  phone: String,
  banned: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
