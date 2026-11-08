import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryStore } from '../config/store.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isMongoConnected) {
      const user = await User.findById(userId).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    }

    const memUser = inMemoryStore.users.find((u) => (u._id || u.id) === userId);
    if (memUser) {
      const { password, ...withoutPass } = memUser;
      return res.json({ success: true, user: withoutPass });
    }

    return res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, phone, address } = req.body;

    if (isMongoConnected) {
      const user = await User.findById(userId);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        const updated = await user.save();
        return res.json({
          success: true,
          user: {
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            address: updated.address,
            role: updated.role,
          },
        });
      }
    }

    const index = inMemoryStore.users.findIndex((u) => (u._id || u.id) === userId);
    if (index !== -1) {
      if (name) inMemoryStore.users[index].name = name;
      if (phone !== undefined) inMemoryStore.users[index].phone = phone;
      if (address !== undefined) inMemoryStore.users[index].address = address;
      const { password, ...withoutPass } = inMemoryStore.users[index];
      return res.json({ success: true, user: withoutPass });
    }

    return res.json({
      success: true,
      user: { ...req.user, name, phone, address },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    }

    const clean = inMemoryStore.users.map(({ password, ...rest }) => rest);
    return res.json({ success: true, count: clean.length, users: clean });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

