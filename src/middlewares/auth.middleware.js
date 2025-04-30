const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Seller = require("../models/seller.model");

dotenv.config();

exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const seller = await Seller.findById(decoded.id).select("-password");
      if (!seller) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.seller = seller;
      next();
    } catch (err) {
      console.error("Auth error:", err.message);
      res.status(401).json({ message: "Token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
