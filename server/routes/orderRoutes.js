import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryStore } from '../config/store.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Public / Authenticated
router.post('/', async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
      subtotal,
      deliveryFee,
      discount,
      tax,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!deliveryAddress || !deliveryAddress.customerName || !deliveryAddress.streetAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }

    // Determine user ID if authenticated
    let userId = 'guest_customer';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crave_craft_super_secret_jwt_key_2026');
        userId = decoded.id;
      } catch (e) {
        // guest mode
      }
    }

    const orderData = {
      userId,
      items,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentStatus || (paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed (Simulated)'),
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee || 0),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      totalAmount: Number(totalAmount),
      orderStatus: 'Confirmed',
    };

    if (isMongoConnected) {
      const order = await Order.create(orderData);
      return res.status(201).json({ success: true, order });
    }

    // In-memory store
    const memOrder = {
      _id: 'ord_' + Math.random().toString(36).substring(2, 9),
      ...orderData,
      createdAt: new Date(),
    };
    inMemoryStore.orders.unshift(memOrder);

    return res.status(201).json({ success: true, order: memOrder });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const rawUserId = req.user._id || req.user.id;
    const strUserId = String(rawUserId);

    if (isMongoConnected) {
      const queryConditions = [{ userId: strUserId }];
      if (mongoose.Types.ObjectId.isValid(strUserId)) {
        queryConditions.push({ userId: new mongoose.Types.ObjectId(strUserId) });
      }

      // Also include guest orders if matching customer phone/name
      if (req.user.phone) {
        queryConditions.push({ 'deliveryAddress.phone': req.user.phone });
      }

      const orders = await Order.find({ $or: queryConditions }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    // In-memory store fallback
    const userOrders = inMemoryStore.orders.filter(
      (o) =>
        String(o.userId) === strUserId ||
        o.userId === 'guest_customer' ||
        (req.user.phone && o.deliveryAddress?.phone === req.user.phone) ||
        req.user.role === 'customer'
    );

    return res.json({
      success: true,
      count: userOrders.length,
      orders: userOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public / Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const order = await Order.findById(id);
        if (order) return res.json({ success: true, order });
      }
      const order = await Order.findOne({ _id: id });
      if (order) return res.json({ success: true, order });
    }

    const memOrder = inMemoryStore.orders.find((o) => (o._id || o.id) === id);
    if (memOrder) {
      return res.json({ success: true, order: memOrder });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (status && status !== 'All') {
        query.orderStatus = status;
      }
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    let results = [...inMemoryStore.orders];
    if (status && status !== 'All') {
      results = results.filter((o) => o.orderStatus === status);
    }

    return res.json({
      success: true,
      count: results.length,
      orders: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowed = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (isMongoConnected) {
      let order = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ _id: id });
      }

      if (order) {
        order.orderStatus = orderStatus;
        const updated = await order.save();
        return res.json({ success: true, order: updated });
      }
    }

    const index = inMemoryStore.orders.findIndex((o) => (o._id || o.id) === id);
    if (index !== -1) {
      inMemoryStore.orders[index].orderStatus = orderStatus;
      return res.json({ success: true, order: inMemoryStore.orders[index] });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
