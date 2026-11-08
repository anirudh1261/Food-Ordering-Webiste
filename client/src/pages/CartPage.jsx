import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Check, 
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    tax,
    totalAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 shadow-soft border border-slate-100">
          <div className="w-24 h-24 bg-orange-50 text-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag size={48} className="stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your order yet. Explore our delicious menus and discover something tasty!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-glow hover:shadow-lg transition-all"
          >
            <Sparkles size={16} />
            <span>Explore Delicious Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Review Order
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            <span>Add More Food</span>
          </Link>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => {
            const id = item._id || item.id;
            return (
              <div
                key={id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-white/95 p-1 rounded-md">
                      {item.isVeg ? (
                        <span className="veg-badge scale-75" />
                      ) : (
                        <span className="non-veg-badge scale-75" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-primary-500 uppercase">
                      {item.category || 'Dishes'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ₹{Number(item.price).toFixed(0)} each
                    </p>
                  </div>
                </div>

                {/* Quantity Stepper & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-orange-50/80 border border-primary-200 rounded-2xl p-1">
                    <button
                      onClick={() => updateQuantity(id, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white text-primary-600 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-xs font-bold text-slate-900 px-2 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Delivery Note */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Free Delivery Notice:</strong> Add ₹
              {Math.max(0, 499 - subtotal).toFixed(0)} more of food to unlock complimentary delivery on this order!
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-lg space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(0)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    `₹${deliveryFee.toFixed(0)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Restaurant Packaging (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-2xl font-extrabold text-primary-600">
                  ₹{totalAmount.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Have a coupon code?
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-2xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" />
                    <span><strong>{appliedPromo.code}</strong> applied ({appliedPromo.description})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter CRAVE30, FREESHIP..."
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-glow hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Safe & Contactless Delivery Available</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;

