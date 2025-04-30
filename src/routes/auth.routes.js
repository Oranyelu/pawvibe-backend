const express = require("express");
const {
  registerUser,
  loginUser,
  validateRegister,
  validateLogin,
  loginLimiter,
} = require("../controllers/auth.controller");

const router = express.Router();

// Register route with validation middleware
router.post("/register", validateRegister, registerUser);

// Login route with rate limiter and validation middleware
router.post("/login", loginLimiter, validateLogin, loginUser);

module.exports = router;
