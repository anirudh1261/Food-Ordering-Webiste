import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles,
  Heart
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RatingStars from '../components/RatingStars';
import api from '../services/api';
import { initialFoods } from '../data/mockData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FoodDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFood = async () => {
      try {
        const res = await api.get(`/foods/${id}`);
        if (res.data && res.data.food) {
          setFood(res.data.food);
          // fetch related
          const allRes = await api.get('/foods');
          if (allRes.data && allRes.data.foods) {
            const related = allRes.data.foods.filter(
              (f) => (f._id !== id) && f.category === res.data.food.category
            );
            setRelatedFoods(related.slice(0, 3));
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to mock data
        const found = initialFoods.find((f) => (f._id || f.id) === id);
        if (found) {
          setFood(found);
          const related = initialFoods.filter(
            (f) => (f._id || f.id) !== id && f.category === found.category
          );
          setRelatedFoods(related.slice(0, 3));
        }
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl shadow-soft">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Food Item Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The item you are looking for may have been retired.</p>
        <Link
          to="/menu"
          className="px-5 py-2.5 bg-primary-500 text-white rounded-2xl text-xs font-bold shadow-glow"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(food, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Large Image */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-slate-100 aspect-square bg-slate-100">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            {/* Floating Veg / Non-Veg badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-2 rounded-xl shadow-md">
              {food.isVeg ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="veg-badge" />
                  <span>Vegetarian</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <span className="non-veg-badge" />
                  <span>Non-Veg</span>
                </div>
              )}
            </div>

            {/* Favorite toggle button */}
            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                toast.success(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors shadow-md"
              aria-label="Save to favorites"
            >
              <Heart
                size={20}
                className={isFavorite ? 'fill-rose-500 text-rose-500' : ''}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Details & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                {food.category}
              </span>
              {food.available !== false ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  In Stock & Ready
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Sold Out Today
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {food.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-3">
              <RatingStars
                rating={food.rating || 4.8}
                size={18}
                showNumber={true}
                reviewsCount={food.numReviews || 120}
              />
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                100% Chef Verified
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{Number(food.price).toFixed(0)}
            </span>
            <span className="text-xs text-slate-400">Taxes & fees calculated at checkout</span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {food.description}
          </p>

          {/* Highlights Grid (Prep Time, Calories, Fresh Guarantee) */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100">
            <div className="bg-cream-100/60 p-3 rounded-2xl text-center">
              <Clock size={18} className="mx-auto text-primary-500 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Prep Time</span>
              <span className="text-xs font-extrabold text-slate-800">{food.prepTime || '15-20 min'}</span>
            </div>
            <div className="bg-cream-100/60 p-3 rounded-2xl text-center">
              <Flame size={18} className="mx-auto text-amber-500 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Calories</span>
              <span className="text-xs font-extrabold text-slate-800">{food.calories || '550 kcal'}</span>
            </div>
            <div className="bg-cream-100/60 p-3 rounded-2xl text-center">
              <ShieldCheck size={18} className="mx-auto text-emerald-500 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Hygiene</span>
              <span className="text-xs font-extrabold text-slate-800">5-Star Safe</span>
            </div>
          </div>

          {/* Quantity and Add to Cart Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between sm:justify-start gap-4 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-soft w-full sm:w-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm font-bold text-slate-800 px-3 min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-orange-50 text-primary-600 flex items-center justify-center hover:bg-orange-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={food.available === false}
              className={`flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-glow hover:shadow-lg ${
                food.available === false
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary-500 hover:bg-primary-600 text-white active:scale-[0.98]'
              }`}
            >
              <ShoppingBag size={18} />
              <span>
                Add {quantity} to Cart • ₹{(Number(food.price) * quantity).toFixed(0)}
              </span>
            </button>
          </div>

          {/* Assurance note */}
          <p className="text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles size={13} className="text-amber-500 shrink-0" />
            <span>Guaranteed piping hot upon arrival or our complimentary replacement.</span>
          </p>

        </div>
      </div>

      {/* Related Food Recommendations */}
      {relatedFoods.length > 0 && (
        <section className="pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
                You Might Also Crave
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                More from {food.category}
              </h2>
            </div>
            <Link
              to={`/menu?category=${encodeURIComponent(food.category)}`}
              className="text-xs font-bold text-primary-600 hover:underline"
            >
              View all {food.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedFoods.map((item) => (
              <FoodCard key={item._id || item.id} food={item} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default FoodDetailsPage;

