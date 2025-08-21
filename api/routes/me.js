// api/routes/me.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';        // adjust path if necessary
import { requireAuth } from '../middlewares/auth.js'; // if you want to use middleware

const router = express.Router();

// GET /api/me
router.get('/', async (req, res) => {
  try {
    const token = req.cookies?.[process.env.SESSION_COOKIE_NAME];
    if (!token) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'No session' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).lean();

    if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });

    res.json({ id: user._id, email: user.email, name: user.name, picture: user.picture, username: user.username || null });
  } catch (err) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
});

// PATCH /api/me  -> update name / username
router.patch('/', async (req, res) => {
  try {
    const token = req.cookies?.[process.env.SESSION_COOKIE_NAME];
    if (!token) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'No session' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.username) updates.username = req.body.username;

    const user = await User.findByIdAndUpdate(payload.id, { $set: updates }, { new: true }).lean();

    if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
    res.json({ id: user._id, email: user.email, name: user.name, username: user.username || null, picture: user.picture });
  } catch (err) {
    console.error(err);
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
});

export default router;
