const { Product } = require("../models/product.model");
const cloudinary = require("../utils/cloudinary");

const uploadImageToCloudinary = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "pawvibe/products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const seller = req.seller;
    const { name, description, category, price, location, breed, age } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const product = await Product.create({
      seller: seller._id,
      name,
      description,
      category,
      price,
      image: imageUrl,
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

const updateProduct = async (req, res) => {
  try {
    const seller = req.seller;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== seller._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    // If there's a new image, upload and replace it
    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer);
      product.image = imageUrl;
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Define getAllProducts function
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Define getProductById function
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Define deleteProduct function
const deleteProduct = async (req, res) => {
  try {
    const seller = req.seller;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await product.remove();

    res.status(200).json({ message: "Product deleted successfully" });
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
  deleteProduct,  // Ensure this is included
};
