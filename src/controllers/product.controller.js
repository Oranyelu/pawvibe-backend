const { Product } = require("../models/product.model");

const createProduct = async (req, res) => {
  try {
    const seller = req.seller;

    const {
      name,
      description,
      category,
      price,
      images,
      location,
      breed,
      age,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const product = await Product.create({
      seller: seller._id,
      name,
      description,
      category,
      price,
      images,
      location,
      breed,
      age,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category, keyword } = req.query;

    const query = {};
    if (category) query.category = category;
    if (keyword)
      query.name = { $regex: keyword, $options: "i" };

    const products = await Product.find(query).populate("seller", "businessName email");
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "businessName");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const seller = req.seller;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== seller._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const seller = req.seller;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== seller._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
