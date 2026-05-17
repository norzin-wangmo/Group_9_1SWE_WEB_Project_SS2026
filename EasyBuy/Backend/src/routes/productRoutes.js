const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createProductSchema, updateProductSchema } = require('../validation/schemas');

// Public routes
router.get('/', getAllProducts);

// NOTE: /user/my MUST be declared before /:id, otherwise Express matches
// the string "user" as a product ID and calls getProductById instead.
router.get('/user/my', protect, getMyProducts);
router.get('/:id', getProductById);

// Protected routes (must be logged in)
router.post('/', protect, validate(createProductSchema), createProduct);
router.put('/:id', protect, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
