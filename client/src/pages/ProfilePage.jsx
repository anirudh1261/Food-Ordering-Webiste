import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ShieldCheck, ClipboardList, LogOut, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Account Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            My Profile
          </h1>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Avatar & Quick Stats Card */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-amber-400 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-inner uppercase">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-primary-800 uppercase tracking-wider">
              {user?.role || 'Customer'}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              to="/my-orders"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-primary-600 text-xs font-bold transition-colors"
            >
              <ClipboardList size={15} />
              <span>View My Orders</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors border border-amber-200"
              >
                <ShieldCheck size={15} />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Personal & Delivery Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                <span>Email Address (Account ID)</span>
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>Primary Delivery Address</span>
              </label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, building, city, zip"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm shadow-glow transition-all"
            >
              <Save size={15} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;

