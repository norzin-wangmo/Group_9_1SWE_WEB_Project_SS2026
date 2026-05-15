const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getInbox,
  getSent,
  getConversation,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(protect);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/sent', getSent);
router.get('/unread-count', getUnreadCount);
router.get('/conversation/:userId', getConversation);
router.delete('/:id', deleteMessage);

module.exports = router;
