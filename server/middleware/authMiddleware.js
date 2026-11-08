import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryStore } from '../config/store.js';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'crave_craft_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'crave_craft_super_secret_jwt_key_2026'
      );

      // Try finding user in Mongoose
      try {
        const found = await User.findById(decoded.id).select('-password');
        if (found) {
          req.user = found;
          return next();
        }
      } catch (e) {
        // Fallback to store
      }

      // Check inMemoryStore
      const memUser = inMemoryStore.users.find(
        (u) => (u._id || u.id) === decoded.id
      );
      if (memUser) {
        const { password, ...userWithoutPass } = memUser;
        req.user = userWithoutPass;
        return next();
      }

      // If user not in DB/memory but token is valid (e.g. demo tokens)
      req.user = {
        _id: decoded.id,
        role: decoded.role || 'customer',
      };
      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required',
    });
  }
};

