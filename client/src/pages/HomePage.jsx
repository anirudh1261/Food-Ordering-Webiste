import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Star, 
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Award
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RatingStars from '../components/RatingStars';
import api from '../services/api';
import { 
  initialCategories, 
  initialFoods, 
  restaurants, 
  specialOffers, 
  customerReviews 
} from '../data/mockData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [foods, setFoods] = useState(initialFoods);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { applyPromoCode } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, catRes] = await Promise.allSettled([
          api.get('/foods'),
          api.get('/categories')
        ]);

        if (foodsRes.status === 'fulfilled' && foodsRes.value.data?.foods?.length > 0) {
          setFoods(foodsRes.value.data.foods);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.categories?.length > 0) {
          setCategories(catRes.value.data.categories);
        }
      } catch (err) {
        console.log('Using initial seed data for home display');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const handleCopyCode = (code) => {
    applyPromoCode(code);
  };

  // Popular dishes (highest rated or first 6)
  const popularDishes = [...foods]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 -z-10 w-72 h-72 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 text-primary-700 text-xs font-extrabold tracking-wide uppercase shadow-xs">
                <Sparkles size={14} className="text-primary-600 animate-pulse" />
                <span>The Premier Food Destination</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Delicious Food, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500">
                  Delivered To Your Door.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Experience gourmet cuisine prepared by top culinary masters. From sizzling stone-fired pizzas to artisan burgers and authentic Asian bowls, fresh & steaming fast.
              </p>

              {/* Search Bar Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-3xl shadow-soft-lg border border-orange-100 flex items-center gap-2 max-w-xl transition-all focus-within:ring-2 focus-within:ring-primary-500/20"
              >
                <div className="pl-3 text-slate-400">
                  <Search size={22} className="text-primary-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search burgers, artisan pizza, ramen, tacos..."
                  className="w-full bg-transparent px-2 py-2 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-glow hover:shadow-lg text-sm shrink-0 flex items-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Value Props Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span>Fast 25 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-primary-600 flex items-center justify-center font-bold">
                    ★
                  </div>
                  <span>4.9/5 Gourmet Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    %
                  </div>
                  <span>Free Delivery on ₹499+</span>
                </div>
              </div>
            </div>

            {/* Right Image / Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Dish */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-slate-100 group">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                    alt="Gourmet dish hero"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="bg-primary-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      Today's Spotlight
                    </span>
                    <h3 className="text-xl font-bold mt-1">Artisan Searing Steak Bowl</h3>
                    <p className="text-xs text-slate-200 mt-0.5">Chef Mario's seasonal creation</p>
                  </div>
                </div>

                {/* Floating Badge 1: 30 Min Delivery */}
                <div className="absolute -top-4 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Express Dispatch</p>
                    <p className="text-xs font-extrabold text-slate-900">20-30 Mins avg</p>
                  </div>
                </div>

                {/* Floating Badge 2: Customer Satisfaction */}
                <div className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-900">4.9 Star Rating</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">10,000+ Happy Foodies</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Browse Food Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
              Curated Menus
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Browse Food Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find whatever your appetite craves in just one tap
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.id || cat.name}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-orange-200 shadow-soft hover:shadow-soft-lg flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-orange-50 p-1 mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular Dishes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-extrabold uppercase tracking-wide">
              <Flame size={13} />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Popular Dishes
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top rated by thousands of foodies across the city
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group"
          >
            <span>See Full Menu</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {popularDishes.map((food) => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 4. Special Offers and Discounts Banner */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Exclusive Deals
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Special Offers & Discounts
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tap on any coupon to apply it directly to your shopping bag
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${offer.bgGradient} text-white shadow-soft-lg flex flex-col justify-between`}
            >
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {offer.tag}
                </span>
                <h3 className="text-xl font-extrabold leading-snug">{offer.title}</h3>
                <p className="text-xs text-white/90 mt-2 leading-relaxed">{offer.subtitle}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-xs font-mono font-bold tracking-wider">
                  {offer.code}
                </div>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2 rounded-xl transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  <Tag size={13} />
                  <span>Apply Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Best-Selling Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
              Top Partners
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Best-Selling Restaurants
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Award-winning kitchens certified for hygiene and flavor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg shadow-sm">
                  {rest.badge}
                </span>
                <div className="absolute bottom-3 left-3 bg-primary-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {rest.discount}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {rest.name}
                    </h4>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{rest.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{rest.cuisine}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{rest.deliveryTime}</span>
                  </div>
                  <Link
                    to="/menu"
                    className="text-primary-600 font-bold hover:underline"
                  >
                    Explore Menu →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="bg-cream-100/60 py-16 border-y border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
              Community Love
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              What Our Foodies Say
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real reviews from real food lovers enjoying their meals every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-orange-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.name}</h5>
                    <p className="text-[11px] text-slate-400">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA App / Delivery Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Background cuisine"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
              Hungry Right Now?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Order your favorite meal in less than 60 seconds.
            </h2>
            <p className="text-sm text-slate-300">
              Browse our diverse menu of fresh pizzas, gourmet burgers, bowls and sweet treats.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-glow hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Explore Full Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

