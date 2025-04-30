const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/multer'); // The multer upload middleware

const router = express.Router();

// Pass multer middleware to handle image upload
router.route('/')
  .get(getAllProducts)
  .post(protect, upload.single('image'), createProduct); // Here we handle image upload

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.single('image'), updateProduct)  // Also for updates
  .delete(protect, deleteProduct);

module.exports = router;
