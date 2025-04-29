import { Request, Response } from "express";
import {Order} from "../models/order.model";
import Product  from "../models/product.model";

export const createOrder = async (req: Request, res: Response) => {
  const {
    buyerName,
    buyerPhone,
    buyerEmail,
    buyerAddress,
    items,
    paymentMethod,
  } = req.body;

  const populatedItems = await Promise.all(
    items.map(async (item: { productId: string; quantity: number }) => {
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
    (acc, item: any) => acc + item.quantity * item.price,
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
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("products.product", "name price");

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
};

export const getSellerOrders = async (req: Request, res: Response) => {
  const seller = (req as any).seller;
  const orders = await Order.find({ seller: seller._id }).populate("products.product", "name price");

  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const seller = (req as any).seller;
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.seller.toString() !== seller._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  order.status = status;
  await order.save();

  res.json(order);
};
