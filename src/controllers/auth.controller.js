const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

// Rate-limiting middleware to prevent brute-force attacks during login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
const registerUser = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, username } = req.body;

    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      username, // Now using username
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username, // Return username on successful registration
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error("❌ Error during registration:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
const loginUser = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username, // Return username on successful login
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Validation rules for registration and login
const validateRegister = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("username").notEmpty().withMessage("Username is required"),
  body("name").notEmpty().withMessage("Name is required"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Export the routes and functions
module.exports = {
  registerUser,
  loginUser,
  validateRegister,
  validateLogin,
  loginLimiter, // Export the rate-limiter
};
