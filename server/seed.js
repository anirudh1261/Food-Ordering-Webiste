import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Food from './models/Food.js';
import Order from './models/Order.js';
import { inMemoryStore } from './config/store.js';

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering_db';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Food.deleteMany();
    await Order.deleteMany();
    console.log('Existing collections cleared.');

    // Seed Users
    const hashedUsers = inMemoryStore.users.map((u) => ({
      name: u.name,
      email: u.email,
      password: u.email.includes('admin') ? 'admin123' : 'user123', // Will be hashed by pre-save hook
      phone: u.phone,
      address: u.address,
      role: u.role,
    }));

    for (const userData of hashedUsers) {
      await User.create(userData);
    }
    console.log(`Seeded ${hashedUsers.length} users (Admin: admin@foodie.com / admin123, Customer: john@example.com / user123)`);

    // Seed Categories
    const categoriesData = inMemoryStore.categories.map((c) => ({
      name: c.name,
      image: c.image,
      description: c.description,
    }));
    await Category.insertMany(categoriesData);
    console.log(`Seeded ${categoriesData.length} food categories.`);

    // Seed Foods
    const foodsData = inMemoryStore.foods.map((f) => ({
      name: f.name,
      description: f.description,
      price: f.price,
      image: f.image,
      category: f.category,
      isVeg: f.isVeg,
      rating: f.rating,
      numReviews: f.numReviews,
      prepTime: f.prepTime,
      calories: f.calories,
      available: f.available,
    }));
    await Food.insertMany(foodsData);
    console.log(`Seeded ${foodsData.length} menu items.`);

    // Seed sample customer orders
    const sampleOrders = inMemoryStore.orders.map((o) => ({
      userId: 'usr_customer_1',
      items: o.items,
      deliveryAddress: o.deliveryAddress,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      discount: o.discount,
      tax: o.tax,
      totalAmount: o.totalAmount,
      orderStatus: o.orderStatus,
    }));
    await Order.insertMany(sampleOrders);
    console.log(`Seeded sample orders.`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();

