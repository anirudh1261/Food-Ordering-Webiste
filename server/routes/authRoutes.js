import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryStore } from '../config/store.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new customer account
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected
    if (isMongoConnected) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '',
        address: address || '',
        role: 'customer',
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    }

    // 2. In-memory store fallback
    const existing = inMemoryStore.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: 'customer',
      createdAt: new Date(),
    };

    inMemoryStore.users.push(newUser);
    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected
    if (isMongoConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        return res.json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
          },
        });
      }
    }

    // 2. In-memory store fallback
    const memUser = inMemoryStore.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (memUser) {
      const isMatch = bcrypt.compareSync(password, memUser.password);
      if (isMatch) {
        const token = generateToken(memUser._id, memUser.role);
        return res.json({
          success: true,
          token,
          user: {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            phone: memUser.phone,
            address: memUser.address,
            role: memUser.role,
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

export default router;

