const prisma = require('../utils/prisma');

// ─── GET /api/notifications ───────────────────────────────────────────────────
// Returns all notifications for the logged-in user, newest first.
const getMyNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { userId: req.user.id };
    if (unreadOnly === 'true') where.isRead = false;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    res.status(200).json({
      notifications,
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

// ─── GET /api/notifications/unread-count ─────────────────────────────────────
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
// Marks a single notification as read.
const markAsRead = async (req, res, next) => {
  try {
    const notifId = parseInt(req.params.id);

    const notif = await prisma.notification.findUnique({ where: { id: notifId } });
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    if (notif.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const updated = await prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    });

    res.status(200).json({ message: 'Notification marked as read.', notification: updated });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
// Marks ALL unread notifications for the current user as read.
const markAllAsRead = async (req, res, next) => {
  try {
    const { count } = await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    res.status(200).json({ message: `${count} notification(s) marked as read.` });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
const deleteNotification = async (req, res, next) => {
  try {
    const notifId = parseInt(req.params.id);

    const notif = await prisma.notification.findUnique({ where: { id: notifId } });
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    if (notif.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await prisma.notification.delete({ where: { id: notifId } });

    res.status(200).json({ message: 'Notification deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── Helper (internal use) ────────────────────────────────────────────────────
// Call this from other controllers (e.g. approvalController) to create a notif.
const createNotification = async ({ userId, type, title, body, link }) => {
  return prisma.notification.create({
    data: { userId, type, title, body, link: link || null },
  });
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
};