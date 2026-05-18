const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(protect);

// GET  /api/notifications              → paginated list (supports ?unreadOnly=true)
// GET  /api/notifications/unread-count → count of unread notifications
// PATCH /api/notifications/read-all   → mark all as read
// PATCH /api/notifications/:id/read   → mark one as read
// DELETE /api/notifications/:id       → delete one notification

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;