import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_ordering_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Quick fallback if local MongoDB service isn't running
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ Notice: Could not connect to MongoDB at ${uri} (${error.message}).`);
    console.warn(`🚀 Auto-activating High-Performance In-Memory Data Store with default seed items.`);
    console.warn(`💡 To connect to MongoDB, ensure mongod is running or set MONGODB_URI in server/.env`);
    return null;
  }
};

