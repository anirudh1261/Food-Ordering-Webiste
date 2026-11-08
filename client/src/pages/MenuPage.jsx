import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Utensils } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import api from '../services/api';
import { initialCategories, initialFoods } from '../data/mockData';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('search') || '';

  const [categories, setCategories] = useState(initialCategories);
  const [foods, setFoods] = useState(initialFoods);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Load backend items if available
  useEffect(() => {
    const loadData = async () => {
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
        console.log('Using initial seed data for menu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setDietaryFilter('all');
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter & Sort Pipeline
  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (selectedCategory !== 'All' && food.category !== selectedCategory) {
          return false;
        }

        // Dietary filter
        if (dietaryFilter === 'veg' && !food.isVeg) return false;
        if (dietaryFilter === 'non-veg' && food.isVeg) return false;

        // Search text filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = food.name.toLowerCase().includes(q);
          const matchDesc = food.description?.toLowerCase().includes(q);
          const matchCat = food.category?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return Number(a.price) - Number(b.price);
        }
        if (sortBy === 'price-high') {
          return Number(b.price) - Number(a.price);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        // default: popular (rating * reviews or order)
        return (b.numReviews || 0) - (a.numReviews || 0);
      });
  }, [foods, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-8 sm:p-10 rounded-3xl border border-orange-100">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Fresh & Handcrafted
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Our Culinary Menu
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Explore our chef's signature recipes. Use filters to narrow by dietary preference, price or category.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Pills & Sort */}
      <div className="space-y-5">
        
        {/* Row 1: Search & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, or flavors..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-primary-500 shadow-soft transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dietary toggle & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Veg / Non-Veg filter toggle */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-soft text-xs font-semibold">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Veg Only</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-soft text-xs font-semibold text-slate-700">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort dishes"
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="popular">Popular Dishes</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Row 2: Category Scrollable Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'All'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
            }`}
          >
            All Categories ({foods.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id || cat.id || cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
              }`}
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover"
                />
              )}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900">{filteredFoods.length}</strong> delicious items</span>
            {selectedCategory !== 'All' && (
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                Category: {selectedCategory}
              </span>
            )}
            {dietaryFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium capitalize">
                {dietaryFilter}
              </span>
            )}
            {searchQuery && (
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                "{searchQuery}"
              </span>
            )}
          </div>

          {(selectedCategory !== 'All' || dietaryFilter !== 'all' || searchQuery || sortBy !== 'popular') && (
            <button
              onClick={handleClearFilters}
              className="text-primary-600 hover:underline font-bold"
            >
              Reset all filters
            </button>
          )}
        </div>

      </div>

      {/* Food Cards Grid or Empty State */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-soft my-12">
          <div className="w-16 h-16 bg-orange-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Dishes Found</h3>
          <p className="text-xs text-slate-500 mb-6">
            We couldn't find any dishes matching your current search or dietary filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-2xl bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 transition-colors shadow-glow"
          >
            Clear Filters & View All
          </button>
        </div>
      )}

    </div>
  );
};

export default MenuPage;

