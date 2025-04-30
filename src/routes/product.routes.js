const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.route('/').get(getAllProducts).post(protect, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
