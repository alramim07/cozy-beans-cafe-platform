// Contact routes: public POST + admin GET/PATCH/DELETE
const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// ----- Public route -----
// POST /api/contact - validate and save a contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};

    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required.');
    if (!email || !email.trim()) errors.push('Email is required.');
    if (!message || !message.trim()) errors.push('Message is required.');
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push('Please enter a valid email address.');

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const saved = await Message.create({ name, message, email });
    res.status(201).json({
      success: true,
      message: 'Thanks! Your message has been sent.',
      id: saved._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: msgs.join(' ') });
    }
    next(err);
  }
});

// ----- Admin-only routes -----
// GET /api/contact - list all messages (newest first)
router.get('/', auth, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contact/:id - mark read/unread
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: !!isRead },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contact/:id - delete message
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;