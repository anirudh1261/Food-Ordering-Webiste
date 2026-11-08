import express from 'express';
import Food from '../models/Food.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryStore } from '../config/store.js';

const router = express.Router();

// @route   GET /api/foods
// @desc    Get all foods with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, isVeg } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (isVeg !== undefined) {
        query.isVeg = isVeg === 'true';
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const foods = await Food.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: foods.length, foods });
    }

    // In-memory fallback
    let results = [...inMemoryStore.foods];
    if (category && category !== 'All') {
      results = results.filter((f) => f.category === category);
    }
    if (isVeg !== undefined) {
      const boolVeg = isVeg === 'true';
      results = results.filter((f) => f.isVeg === boolVeg);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: results.length, foods: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/foods/:id
// @desc    Get single food item details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const food = await Food.findById(id);
      if (food) {
        return res.json({ success: true, food });
      }
    }

    const memFood = inMemoryStore.foods.find((f) => (f._id || f.id) === id);
    if (memFood) {
      return res.json({ success: true, food: memFood });
    }

    return res.status(404).json({ success: false, message: 'Food item not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/foods
// @desc    Create new food item
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, image, category, isVeg, prepTime, calories, available } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required' });
    }

    if (isMongoConnected) {
      const newFood = await Food.create({
        name,
        description,
        price: Number(price),
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        category,
        isVeg: isVeg !== undefined ? isVeg : true,
        prepTime: prepTime || '15-20 mins',
        calories: calories || '500 kcal',
        available: available !== undefined ? available : true,
      });
      return res.status(201).json({ success: true, food: newFood });
    }

    const memFood = {
      _id: 'food_' + Date.now(),
      name,
      description: description || '',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      category,
      isVeg: isVeg !== undefined ? isVeg : true,
      rating: 4.8,
      numReviews: 1,
      prepTime: prepTime || '15-20 mins',
      calories: calories || '500 kcal',
      available: available !== undefined ? available : true,
      createdAt: new Date(),
    };
    inMemoryStore.foods.unshift(memFood);
    return res.status(201).json({ success: true, food: memFood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/foods/:id
// @desc    Update a food item
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const food = await Food.findById(id);
      if (food) {
        Object.assign(food, req.body);
        const updated = await food.save();
        return res.json({ success: true, food: updated });
      }
    }

    const index = inMemoryStore.foods.findIndex((f) => (f._id || f.id) === id);
    if (index !== -1) {
      inMemoryStore.foods[index] = { ...inMemoryStore.foods[index], ...req.body };
      return res.json({ success: true, food: inMemoryStore.foods[index] });
    }

    return res.status(404).json({ success: false, message: 'Food item not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/foods/:id
// @desc    Delete a food item
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const food = await Food.findById(id);
      if (food) {
        await food.deleteOne();
        return res.json({ success: true, message: 'Food item deleted successfully' });
      }
    }

    const index = inMemoryStore.foods.findIndex((f) => (f._id || f.id) === id);
    if (index !== -1) {
      inMemoryStore.foods.splice(index, 1);
      return res.json({ success: true, message: 'Food item deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Food item not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

