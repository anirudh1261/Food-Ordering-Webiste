import express from 'express';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryStore } from '../config/store.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected) {
      const categories = await Category.find({}).sort({ createdAt: 1 });
      return res.json({ success: true, count: categories.length, categories });
    }

    return res.json({
      success: true,
      count: inMemoryStore.categories.length,
      categories: inMemoryStore.categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, image, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    if (isMongoConnected) {
      const category = await Category.create({ name, image, description });
      return res.status(201).json({ success: true, category });
    }

    const newCat = {
      _id: 'cat_' + Date.now(),
      name,
      image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
      description: description || '',
      createdAt: new Date(),
    };
    inMemoryStore.categories.push(newCat);
    return res.status(201).json({ success: true, category: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const category = await Category.findById(id);
      if (category) {
        Object.assign(category, req.body);
        const updated = await category.save();
        return res.json({ success: true, category: updated });
      }
    }

    const index = inMemoryStore.categories.findIndex((c) => (c._id || c.id) === id);
    if (index !== -1) {
      inMemoryStore.categories[index] = { ...inMemoryStore.categories[index], ...req.body };
      return res.json({ success: true, category: inMemoryStore.categories[index] });
    }

    return res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const category = await Category.findById(id);
      if (category) {
        await category.deleteOne();
        return res.json({ success: true, message: 'Category deleted' });
      }
    }

    const index = inMemoryStore.categories.findIndex((c) => (c._id || c.id) === id);
    if (index !== -1) {
      inMemoryStore.categories.splice(index, 1);
      return res.json({ success: true, message: 'Category deleted' });
    }

    return res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

