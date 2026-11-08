import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  isVeg: {
    type: Boolean,
    default: true,
  },
});

const deliveryAddressSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: deliveryAddressSchema,
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

