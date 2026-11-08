import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Layers, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { initialCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.categories?.length > 0) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.warn('Categories loaded from default set');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      image: cat.image,
      description: cat.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      if (editingCat) {
        const id = editingCat._id || editingCat.id;
        await api.put(`/categories/${id}`, formData);
        setCategories((prev) =>
          prev.map((c) => ((c._id || c.id) === id ? { ...c, ...formData } : c))
        );
        toast.success(`Updated category "${formData.name}"`);
      } else {
        const res = await api.post('/categories', formData);
        const created = res.data?.category || {
          _id: 'cat_' + Date.now(),
          ...formData,
        };
        setCategories([...categories, created]);
        toast.success(`Created category "${formData.name}"`);
      }
      setIsModalOpen(false);
    } catch (err) {
      // optimistic update
      if (editingCat) {
        const id = editingCat._id || editingCat.id;
        setCategories((prev) =>
          prev.map((c) => ((c._id || c.id) === id ? { ...c, ...formData } : c))
        );
        toast.success(`Updated "${formData.name}" locally`);
      } else {
        const created = {
          _id: 'cat_' + Date.now(),
          ...formData,
        };
        setCategories([...categories, created]);
        toast.success(`Created "${formData.name}" locally`);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      toast.success('Category deleted');
    } catch (err) {
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      toast.success('Category deleted locally');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Structure & Cuisines
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Food Categories ({categories.length})
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-glow transition-all"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const id = cat._id || cat.id;
          return (
            <div
              key={id}
              className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden flex flex-col justify-between group hover:shadow-soft-lg transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.description || 'Curated dishes and signature items'}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-slate-500 hover:text-primary-600 rounded-lg hover:bg-orange-50 transition-colors"
                  title="Edit Category"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCat ? 'Edit Food Category' : 'Create Food Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Seafood & Grills"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Image URL
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
                  placeholder="Brief summary of cuisine or specialties..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                />
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
                  {editingCat ? 'Save Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;

