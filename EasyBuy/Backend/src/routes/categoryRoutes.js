// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createCategorySchema, updateCategorySchema } = require('../validation/schemas');

// ─── Public ───────────────────────────────────────────────────────────────────
// GET  /api/categories       → list all categories (with product count)
// GET  /api/categories/:id   → one category + its products

router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);

// ─── Admin only ───────────────────────────────────────────────────────────────
// POST   /api/categories        → create a new category
// PUT    /api/categories/:id    → update name / description
// DELETE /api/categories/:id    → remove category (products become uncategorised)

router.post(  '/',    protect, adminOnly, validate(createCategorySchema), createCategory);
router.put(   '/:id', protect, adminOnly, validate(updateCategorySchema), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;