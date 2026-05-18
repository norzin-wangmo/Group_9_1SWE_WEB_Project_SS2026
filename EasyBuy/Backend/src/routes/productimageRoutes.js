// src/routes/productImageRoutes.js
// These routes are mounted as a sub-router inside productRoutes.js:
//   router.use('/:productId/images', productImageRoutes);
// which produces URLs like:
//   GET    /api/products/:productId/images
//   POST   /api/products/:productId/images
//   PATCH  /api/products/:productId/images/:imageId
//   DELETE /api/products/:productId/images/:imageId

const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :productId
const {
  getProductImages,
  addProductImages,
  updateProductImage,
  deleteProductImage,
} = require('../controllers/productImageController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/', getProductImages);

// Seller must be logged in
router.post(  '/',          protect, addProductImages);
router.patch( '/:imageId',  protect, updateProductImage);
router.delete('/:imageId',  protect, deleteProductImage);

module.exports = router;