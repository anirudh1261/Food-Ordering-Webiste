import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  UtensilsCrossed,
  Filter,
  Star,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { initialFoods, initialCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

const AdminFoods = () => {
  const [foods, setFoods] = useState(initialFoods);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Burgers',
    isVeg: true,
    prepTime: '15-20 mins',
    available: true,
  });

  const loadFoodsAndCategories = async () => {
    try {
      const [foodsRes, catsRes] = await Promise.allSettled([
        api.get('/foods'),
        api.get('/categories')
      ]);

      if (foodsRes.status === 'fulfilled' && foodsRes.value.data?.foods?.length > 0) {
        setFoods(foodsRes.value.data.foods);
      }
      if (catsRes.status === 'fulfilled' && catsRes.value.data?.categories?.length > 0) {
        setCategories(catsRes.value.data.categories);
      }
    } catch (err) {
      console.warn('Admin foods using local seed store');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoodsAndCategories();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      category: categories[0]?.name || 'Burgers',
      isVeg: true,
      prepTime: '15-20 mins',
      available: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category,
      isVeg: food.isVeg,
      prepTime: food.prepTime || '15-20 mins',
      available: food.available ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      if (editingFood) {
        const id = editingFood._id || editingFood.id;
        await api.put(`/foods/${id}`, formData);
        setFoods((prev) =>
          prev.map((f) => ((f._id || f.id) === id ? { ...f, ...formData, price: Number(formData.price) } : f))
        );
        toast.success(`Updated "${formData.name}" successfully!`);
      } else {
        const res = await api.post('/foods', formData);
        const created = res.data?.food || {
          _id: 'food_' + Date.now(),
          ...formData,
          price: Number(formData.price),
          rating: 4.8,
          numReviews: 1,
        };
        setFoods([created, ...foods]);
        toast.success(`Added new dish "${formData.name}"!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      // optimistic update
      if (editingFood) {
        const id = editingFood._id || editingFood.id;
        setFoods((prev) =>
          prev.map((f) => ((f._id || f.id) === id ? { ...f, ...formData, price: Number(formData.price) } : f))
        );
        toast.success(`Updated "${formData.name}" locally!`);
      } else {
        const created = {
          _id: 'food_' + Date.now(),
          ...formData,
          price: Number(formData.price),
          rating: 4.9,
          numReviews: 1,
        };
        setFoods([created, ...foods]);
        toast.success(`Added "${formData.name}" locally!`);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => (f._id || f.id) !== id));
      toast.success('Food item deleted.');
    } catch (err) {
      setFoods((prev) => prev.filter((f) => (f._id || f.id) !== id));
      toast.success('Food item deleted (Local).');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const toggleAvailability = async (food) => {
    const id = food._id || food.id;
    const newStatus = !food.available;
    try {
      await api.put(`/foods/${id}`, { available: newStatus });
      setFoods((prev) =>
        prev.map((f) => ((f._id || f.id) === id ? { ...f, available: newStatus } : f))
      );
      toast.success(`${food.name} marked as ${newStatus ? 'Available' : 'Sold Out'}`);
    } catch (err) {
      setFoods((prev) =>
        prev.map((f) => ((f._id || f.id) === id ? { ...f, available: newStatus } : f))
      );
      toast.success(`${food.name} marked as ${newStatus ? 'Available' : 'Sold Out'} (Local)`);
    }
  };

  const filteredFoods = foods.filter((food) => {
    if (selectedCat !== 'All' && food.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        food.name.toLowerCase().includes(q) ||
        food.description?.toLowerCase().includes(q) ||
        food.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Menu Dishes ({foods.length})
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-glow transition-all"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food by name..."
            className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            aria-label="Filter by category"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Diet</th>
                <th className="py-3 px-6">Rating</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredFoods.map((food) => {
                const id = food._id || food.id;
                return (
                  <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 leading-snug">{food.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6">
                      <span className="bg-orange-50 text-primary-700 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {food.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">
                      ₹{Number(food.price).toFixed(0)}
                    </td>

                    {/* Diet */}
                    <td className="py-3.5 px-6">
                      {food.isVeg ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                          <span className="veg-badge scale-75" />
                          <span>Veg</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-700 text-[11px] font-bold">
                          <span className="non-veg-badge scale-75" />
                          <span>Non-Veg</span>
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{food.rating ? food.rating.toFixed(1) : '4.8'}</span>
                      </div>
                    </td>

                    {/* Availability toggle */}
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => toggleAvailability(food)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          food.available !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {food.available !== false ? '● In Stock' : '✕ Sold Out'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 rounded-lg hover:bg-orange-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove this dish from your restaurant menu?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingFood ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Truffle Burger"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="349"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe ingredients, cooking method, flavors..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="15-20 mins"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span>Pure Veg</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span>Available</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-glow"
                >
                  {editingFood ? 'Save Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFoods;

