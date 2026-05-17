const prisma = require('../utils/prisma');

// ─── POST /api/messages ───────────────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId and content are required.' });
    }

    if (parseInt(receiverId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a message to yourself.' });
    }

    const receiver = await prisma.user.findUnique({ where: { id: parseInt(receiverId) } });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId: parseInt(receiverId),
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ message: 'Message sent.', data: message });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/messages/inbox ──────────────────────────────────────────────────
const getInbox = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { receiverId: req.user.id },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/messages/sent ───────────────────────────────────────────────────
const getSent = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { senderId: req.user.id },
      include: {
        receiver: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/messages/conversation/:userId ───────────────────────────────────
const getConversation = async (req, res, next) => {
  try {
    const otherUserId = parseInt(req.params.userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages sent to current user as read
    await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/messages/:id ─────────────────────────────────────────────────
const deleteMessage = async (req, res, next) => {
  try {
    const messageId = parseInt(req.params.id);

    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    // Only the sender can delete a message
    if (message.senderId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message.' });
    }

    await prisma.message.delete({ where: { id: messageId } });

    res.status(200).json({ message: 'Message deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/messages/unread-count ──────────────────────────────────────────
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.message.count({
      where: { receiverId: req.user.id, isRead: false },
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getInbox,
  getSent,
  getConversation,
  deleteMessage,
  getUnreadCount,
};
