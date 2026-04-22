const pool = require('../config/db');

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, product_id, message_text } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !product_id || !message_text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, product_id, message_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sender_id, receiver_id, product_id, message_text]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT m.*,
              sender.full_name AS sender_name,
              receiver.full_name AS receiver_name,
              p.title AS product_title
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       JOIN products p ON m.product_id = p.id
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getMyMessages };