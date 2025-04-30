const express = require('express');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const router = express.Router();

router.get('/users', async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/ban/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { banned: true }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/verify/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products', async (_, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', async (_, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
