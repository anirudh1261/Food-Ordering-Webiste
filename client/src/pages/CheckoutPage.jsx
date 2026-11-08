import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  FileText,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryFee, discount, tax, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'upi'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Please complete all required delivery fields.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      items: cartItems.map((item) => ({
        foodId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
        isVeg: item.isVeg,
      })),
      deliveryAddress: {
        customerName: formData.name,
        phone: formData.phone,
        streetAddress: formData.address,
        notes: formData.notes,
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Simulated Online Payment',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Completed (Simulated)',
      subtotal,
      deliveryFee,
      discount,
      tax,
      totalAmount,
    };

    try {
      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data?.order || {
        _id: 'ord_' + Math.random().toString(36).substring(2, 9),
        ...orderPayload,
        orderStatus: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${createdOrder._id || createdOrder.id}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      // Fallback for seamless demo if backend connection is unavailable
      const mockOrder = {
        _id: 'ord_' + Math.random().toString(36).substring(2, 9),
        ...orderPayload,
        orderStatus: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      clearCart();
      toast.success('Order placed successfully (Demo mode)!');
      navigate(`/order-success/${mockOrder._id}`, {
        state: { order: mockOrder },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
          Almost Ready
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Checkout & Delivery Details
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Delivery Info & Payment Selection */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Customer & Address Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delivery Information</h3>
                  <p className="text-xs text-slate-400">Where should our courier deliver your gourmet meal?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    <span>Recipient Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    <span>Contact Phone *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span>Full Delivery Street Address *</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Apartment, suite, building, street, landmark, city and zip code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span>Delivery Instructions (Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Leave with security, ring door bell #4, extra napkins please"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Payment Option</h3>
                  <p className="text-xs text-slate-400">Select how you prefer to finalize payment</p>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Demo Simulator:</strong> This application demonstrates both <em>Cash on Delivery</em> and <em>Simulated Online Payment</em>. No real charges will be made.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash On Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'cod'
                      ? 'border-primary-500 bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-primary-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Cash on Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay cash or UPI scan directly to the delivery hero at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Simulated Online Card / UPI */}
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'online'
                      ? 'border-primary-500 bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-primary-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Simulated Online Pay</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Simulate instant card/UPI authorization for testing instant checkout.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Preview & Place Order Button */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-lg space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({cartItems.length} items)
              </h3>

              {/* Items Preview List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[200px]">
                      <span className="font-bold text-slate-800">{item.quantity}x</span>
                      <span className="text-slate-600 truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax & Packaging</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900">
                  <span className="text-sm font-bold">Grand Total</span>
                  <span className="text-2xl font-extrabold text-primary-600">
                    ₹{totalAmount.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-glow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Dispatching Order...</span>
                ) : (
                  <>
                    <span>Place Order • ₹{totalAmount.toFixed(0)}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                By clicking Place Order, you confirm your delivery details.
              </p>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
};

export default CheckoutPage;

