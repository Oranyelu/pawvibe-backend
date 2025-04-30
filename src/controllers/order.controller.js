const Order = require("../models/order.model").Order;
const Product = require("../models/product.model");

const createOrder = async (req, res) => {
  try {
    const {
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress,
      items,
      paymentMethod,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include items." });
    }

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Invalid product ID");
        return {
          product: product._id,
          quantity: item.quantity,
          seller: product.seller,
          price: product.price,
        };
      })
    );

    const totalAmount = populatedItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    const seller = populatedItems[0].seller;

    const order = await Order.create({
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress,
      products: populatedItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalAmount,
      seller,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Something went wrong while creating order." });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("❌ Error getting order by ID:", error);
    res.status(500).json({ message: "Error fetching order." });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const seller = req.seller;
    const orders = await Order.find({ seller: seller._id }).populate("products.product", "name price");
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
    res.status(500).json({ message: "Could not fetch seller orders." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const seller = req.seller;
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  
};
