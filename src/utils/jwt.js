const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET || "supersecret";

/**
 * Generates a JWT for the given user ID.
 * @param {string} id - The user's ID.
 * @returns {string} - Signed JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object} - Decoded payload if valid.
 * @throws {Error} - If token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
