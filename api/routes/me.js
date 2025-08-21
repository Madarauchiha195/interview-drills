// api/routes/me.js
import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/me - Get current user info
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ 
        code: 'NOT_FOUND', 
        message: 'User not found' 
      });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      picture: user.picture,
      providers: user.providers,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to fetch user information' 
    });
  }
});

// PATCH /api/me - Update user profile
router.patch('/', requireAuth, async (req, res) => {
  try {
    const { name, username } = req.body;
    const updates = {};

    // Validate input
    if (name && typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }

    if (username && typeof username === 'string' && username.trim()) {
      // Check if username is already taken
      const existingUser = await User.findOne({ 
        username: username.trim(),
        _id: { $ne: req.user.id }
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          code: 'USERNAME_TAKEN', 
          message: 'Username is already taken' 
        });
      }
      
      updates.username = username.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        code: 'BAD_REQUEST', 
        message: 'No valid updates provided' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ 
        code: 'NOT_FOUND', 
        message: 'User not found' 
      });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      picture: user.picture,
      providers: user.providers,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to update user information' 
    });
  }
});

export default router;
