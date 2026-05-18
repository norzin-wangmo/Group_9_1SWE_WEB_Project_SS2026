const prisma = require('../utils/prisma');

// ─── POST /api/payments ───────────────────────────────────────────────────────
// Creates a payment record (e.g. listing/upload fee for a product).
// In a real app you'd integrate a payment gateway here; for now we record
// the payment and mark it COMPLETED immediately (mock flow).
const createPayment = async (req, res, next) => {
  try {
    const { amount, description, uploadRequestId, reference } = req.body;

    // If tied to an upload request, verify it belongs to this user
    if (uploadRequestId) {
      const uploadReq = await prisma.uploadRequest.findUnique({
        where: { id: parseInt(uploadRequestId) },
      });
      if (!uploadReq) {
        return res.status(404).json({ message: 'Upload request not found.' });
      }
      if (uploadReq.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized.' });
      }
      // Check no payment already exists for this upload request
      const existing = await prisma.payment.findUnique({
        where: { uploadRequestId: parseInt(uploadRequestId) },
      });
      if (existing) {
        return res.status(409).json({ message: 'A payment already exists for this upload request.' });
      }
    }

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        status: 'COMPLETED',          // mock: mark completed immediately
        description: description || null,
        reference: reference || null,
        userId: req.user.id,
        uploadRequestId: uploadRequestId ? parseInt(uploadRequestId) : null,
      },
    });

    res.status(201).json({ message: 'Payment recorded.', payment });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/payments ────────────────────────────────────────────────────────
// Returns all payments for the logged-in user.
const getMyPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { userId: req.user.id };
    if (status) where.status = status.toUpperCase();

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { uploadRequest: { select: { id: true, status: true, productId: true } } },
      }),
      prisma.payment.count({ where }),
    ]);

    res.status(200).json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/payments/:id ────────────────────────────────────────────────────
const getPaymentById = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.id);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { uploadRequest: true },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    // Users can only see their own payments; admins can see all
    if (payment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.status(200).json({ payment });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/payments/admin/all  (admin only) ────────────────────────────────
// Returns all payments across all users for admin review.
const getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) where.status = status.toUpperCase();
    if (userId) where.userId = parseInt(userId);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { id: true, name: true, email: true } },
          uploadRequest: { select: { id: true, status: true, productId: true } },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    res.status(200).json({
      payments,
      pagination: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment, getMyPayments, getPaymentById, getAllPayments };