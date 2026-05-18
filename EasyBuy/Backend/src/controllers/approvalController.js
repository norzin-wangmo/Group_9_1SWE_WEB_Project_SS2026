const prisma = require('../utils/prisma');
const { createNotification } = require('./notificationController');

// ─── POST /api/approvals/request ─────────────────────────────────────────────
// Seller submits an upload request for a product they already created.
// The product stays unpublished until an admin approves the request.
const createUploadRequest = async (req, res, next) => {
  try {
    const { productId, note } = req.body;

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only request approval for your own products.' });
    }

    // Prevent duplicate requests for the same product
    const existing = await prisma.uploadRequest.findUnique({ where: { productId: parseInt(productId) } });
    if (existing) {
      return res.status(409).json({
        message: `An upload request already exists for this product (status: ${existing.status}).`,
        uploadRequest: existing,
      });
    }

    const uploadRequest = await prisma.uploadRequest.create({
      data: {
        userId: req.user.id,
        productId: parseInt(productId),
        note: note || null,
      },
      include: { product: true },
    });

    res.status(201).json({ message: 'Upload request submitted. Awaiting admin review.', uploadRequest });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/approvals/my-requests ──────────────────────────────────────────
// Seller sees their own upload requests and their current status.
const getMyRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status.toUpperCase();

    const requests = await prisma.uploadRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, price: true, category: true } },
        adminReview: { select: { decision: true, reason: true, createdAt: true } },
        payment: { select: { id: true, amount: true, status: true } },
      },
    });

    res.status(200).json({ uploadRequests: requests });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/approvals/pending  (admin only) ─────────────────────────────────
// Admin sees all PENDING upload requests.
const getPendingRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { status: 'PENDING' };

    const [requests, total] = await Promise.all([
      prisma.uploadRequest.findMany({
        where,
        orderBy: { createdAt: 'asc' }, // oldest first so urgent ones surface
        skip,
        take,
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: true,
          payment: { select: { id: true, amount: true, status: true } },
        },
      }),
      prisma.uploadRequest.count({ where }),
    ]);

    res.status(200).json({
      uploadRequests: requests,
      pagination: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/approvals/all  (admin only) ─────────────────────────────────────
// Admin sees all upload requests regardless of status.
const getAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) where.status = status.toUpperCase();
    if (userId) where.userId = parseInt(userId);

    const [requests, total] = await Promise.all([
      prisma.uploadRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: true,
          adminReview: true,
          payment: { select: { id: true, amount: true, status: true } },
        },
      }),
      prisma.uploadRequest.count({ where }),
    ]);

    res.status(200).json({
      uploadRequests: requests,
      pagination: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/approvals/:requestId/review  (admin only) ─────────────────────
// Admin approves or rejects an upload request.
// On approval  → AdminReview created, UploadRequest status → APPROVED, notif sent to seller.
// On rejection → AdminReview created, UploadRequest status → REJECTED, notif sent to seller.
const reviewRequest = async (req, res, next) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { decision, reason } = req.body;

    const normalised = decision?.toUpperCase();
    if (!['APPROVED', 'REJECTED'].includes(normalised)) {
      return res.status(400).json({ message: 'decision must be "APPROVED" or "REJECTED".' });
    }

    const uploadRequest = await prisma.uploadRequest.findUnique({
      where: { id: requestId },
      include: { product: true },
    });
    if (!uploadRequest) {
      return res.status(404).json({ message: 'Upload request not found.' });
    }
    if (uploadRequest.status !== 'PENDING') {
      return res.status(409).json({
        message: `This request has already been reviewed (status: ${uploadRequest.status}).`,
      });
    }

    // Prevent duplicate admin review records
    const existingReview = await prisma.adminReview.findUnique({ where: { uploadRequestId: requestId } });
    if (existingReview) {
      return res.status(409).json({ message: 'A review already exists for this request.' });
    }

    // Use a transaction so both writes succeed or both fail
    const [updatedRequest, adminReview] = await prisma.$transaction([
      prisma.uploadRequest.update({
        where: { id: requestId },
        data: { status: normalised },
      }),
      prisma.adminReview.create({
        data: {
          decision: normalised,
          reason: reason || null,
          adminId: req.user.id,
          uploadRequestId: requestId,
        },
      }),
    ]);

    // Send notification to the seller
    const isApproved = normalised === 'APPROVED';
    await createNotification({
      userId: uploadRequest.userId,
      type: isApproved ? 'PRODUCT_APPROVED' : 'PRODUCT_REJECTED',
      title: isApproved ? 'Product Approved!' : 'Product Rejected',
      body: isApproved
        ? `Your product "${uploadRequest.product.name}" has been approved and is now live.`
        : `Your product "${uploadRequest.product.name}" was rejected. Reason: ${reason || 'No reason provided.'}`,
      link: `/products/${uploadRequest.productId}`,
    });

    res.status(200).json({
      message: `Upload request ${normalised.toLowerCase()}.`,
      uploadRequest: updatedRequest,
      adminReview,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/approvals/:requestId  ──────────────────────────────────────────
// Get a single upload request (seller sees their own; admin sees any).
const getRequestById = async (req, res, next) => {
  try {
    const requestId = parseInt(req.params.requestId);

    const uploadRequest = await prisma.uploadRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: true,
        adminReview: true,
        payment: true,
      },
    });

    if (!uploadRequest) {
      return res.status(404).json({ message: 'Upload request not found.' });
    }

    if (uploadRequest.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.status(200).json({ uploadRequest });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUploadRequest,
  getMyRequests,
  getPendingRequests,
  getAllRequests,
  reviewRequest,
  getRequestById,
};