const express = require('express');
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
} = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createPaymentSchema } = require('../validation/schemas');

// ─── User routes (must be logged in) ─────────────────────────────────────────
// POST   /api/payments            → record a new payment (e.g. listing fee)
// GET    /api/payments            → my payment history
// GET    /api/payments/:id        → single payment detail

router.post('/', protect, validate(createPaymentSchema), createPayment);
router.get('/', protect, getMyPayments);
router.get('/admin/all', protect, adminOnly, getAllPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;