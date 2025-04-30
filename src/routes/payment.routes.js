const express = require("express");
const { initializePayment, verifyPayment } = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/initialize", protect, initializePayment);
router.post("/verify", protect, verifyPayment);

module.exports = router;
