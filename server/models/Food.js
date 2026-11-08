import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    numReviews: {
      type: Number,
      default: 1,
    },
    prepTime: {
      type: String,
      default: '15-20 mins',
    },
    calories: {
      type: String,
      default: '500 kcal',
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);
export default Food;

