import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const id = food._id || food.id;
  const quantity = getItemQuantity(id);

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) {
      addToCart(food, 1);
    } else {
      updateQuantity(id, quantity + 1);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, quantity - 1);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Food Image Container */}
      <Link to={`/foods/${id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Rating Floating Tag */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span>{food.rating ? food.rating.toFixed(1) : '4.8'}</span>
        </div>

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-sm">
          {food.isVeg ? (
            <span className="veg-badge" title="Pure Vegetarian" />
          ) : (
            <span className="non-veg-badge" title="Non-Vegetarian" />
          )}
        </div>

        {/* Prep Time pill if present */}
        {food.prepTime && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock size={11} />
            <span>{food.prepTime}</span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Availability */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="uppercase tracking-wider text-[10px] font-bold text-primary-500">
              {food.category}
            </span>
            {food.available === false && (
              <span className="text-rose-500 font-semibold text-[11px]">Sold Out</span>
            )}
          </div>

          {/* Title */}
          <Link to={`/foods/${id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {food.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{Number(food.price).toFixed(0)}
            </span>
          </div>

          {/* Action button: Add or Stepper */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-orange-50 border border-primary-200 rounded-2xl p-1 shadow-xs">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-xl bg-white text-primary-600 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold text-slate-800 px-1.5 min-w-[16px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              disabled={food.available === false}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                food.available === false
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow hover:shadow-md'
              }`}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

