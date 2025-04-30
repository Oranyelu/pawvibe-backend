const bcrypt = require("bcrypt");
const { Seller } = require("../models/seller.model");
const { generateToken } = require("../utils/jwt");

const registerSeller = async (req, res) => {
  try {
    const { email, password, businessName, phone, address } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Seller.findOne({ email });
    if (exists) return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      email,
      businessName,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      _id: seller._id,
      email: seller.email,
      token: generateToken(seller._id.toString()),
    });
  } catch (err) {
    console.error("❌ Error registering seller:", err);
    res.status(500).json({ message: "Failed to register seller" });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: seller._id,
      email: seller.email,
      token: generateToken(seller._id.toString()),
    });
  } catch (err) {
    console.error("❌ Error logging in seller:", err);
    res.status(500).json({ message: "Failed to login seller" });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
};
