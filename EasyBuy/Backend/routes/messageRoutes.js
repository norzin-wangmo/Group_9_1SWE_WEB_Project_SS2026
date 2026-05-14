const express = require('express');

const router = express.Router();

// Message routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all messages' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Send new message' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get message with id ${req.params.id}` });
});

module.exports = router;
