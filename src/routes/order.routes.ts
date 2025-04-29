import express from 'express';
import Order from '../models/order.model';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('product');
    order ? res.json(order) : res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/status/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;