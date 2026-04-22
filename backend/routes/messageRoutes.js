const express = require('express');
const { sendMessage, getMyMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/', authMiddleware, getMyMessages);

module.exports = router;