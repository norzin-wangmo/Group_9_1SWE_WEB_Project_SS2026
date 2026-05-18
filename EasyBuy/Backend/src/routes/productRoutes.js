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

// Mount product image sub-router FIRST (before /:id) to avoid route conflicts
// Produces: GET/POST /api/products/:productId/images
//           PATCH/DELETE /api/products/:productId/images/:imageId
const productImageRoutes = require('./productImageRoutes');
router.use('/:productId/images', productImageRoutes);

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', getAllProducts);

// NOTE: /user/my MUST be before /:id so Express doesn't treat "user" as an ID
router.get('/user/my', protect, getMyProducts);
router.get('/:id', getProductById);

// ─── Protected ────────────────────────────────────────────────────────────────
router.post(  '/',    protect, validate(createProductSchema), createProduct);
router.put(   '/:id', protect, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;