import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu as MenuIcon, 
  X, 
  LogOut, 
  ShieldCheck, 
  ClipboardList, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, demoLogin, isAdmin } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleQuickDemo = async (role) => {
    setDemoMenuOpen(false);
    await demoLogin(role);
    if (role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-orange-100/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-200">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
              Crave<span className="text-primary-500">Craft</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-600 -mt-1">
              Gourmet Delivery
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-600 ${
                isActive ? 'text-primary-600 font-bold' : ''
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-600 ${
                isActive ? 'text-primary-600 font-bold' : ''
              }`
            }
          >
            Menu
          </NavLink>
          <a
            href="/#offers"
            className="transition-colors hover:text-primary-600"
          >
            Offers & Deals
          </a>
          <NavLink
            to="/my-orders"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-600 ${
                isActive ? 'text-primary-600 font-bold' : ''
              }`
            }
          >
            My Orders
          </NavLink>

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 font-bold text-xs hover:bg-amber-200 transition-all border border-amber-300"
            >
              <ShieldCheck size={14} className="text-amber-600" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-4">
          
          {/* Quick Demo Switcher Pill */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all border border-orange-200"
              title="Quick demo access for evaluation"
            >
              <Sparkles size={13} className="text-orange-500" />
              <span>Demo Fill</span>
              <ChevronDown size={12} />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Instant Test Login
                </div>
                <button
                  onClick={() => handleQuickDemo('customer')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-primary-600 font-medium flex items-center justify-between"
                >
                  <span>Customer (John)</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Buyer</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('admin')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-primary-600 font-medium flex items-center justify-between"
                >
                  <span>Admin (Manager)</span>
                  <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-700 font-bold">Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-primary-400 text-slate-700 hover:text-primary-600 transition-all shadow-xs group"
            aria-label="View shopping cart"
          >
            <ShoppingBag size={21} className="group-hover:scale-105 transition-transform" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 text-white font-extrabold text-[11px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-amber-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                      {user.role || 'Customer'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-primary-600 transition-colors"
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-primary-600 transition-colors"
                  >
                    <ClipboardList size={15} />
                    My Orders
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors border-t border-slate-50"
                    >
                      <ShieldCheck size={15} className="text-amber-600" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-orange-50/60 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 animate-in slide-in-from-top-3">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-primary-600"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-primary-600"
            >
              Browse Menu
            </Link>
            <a
              href="/#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-primary-600"
            >
              Offers & Discounts
            </a>
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-primary-600"
            >
              My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-amber-700 font-bold flex items-center gap-1.5"
              >
                <ShieldCheck size={16} /> Admin Portal
              </Link>
            )}
          </nav>

          {/* Mobile quick test login */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant Demo Testing
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleQuickDemo('customer');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold bg-orange-50 text-orange-700 rounded-xl border border-orange-200 text-center"
              >
                Login as Customer
              </button>
              <button
                onClick={() => {
                  handleQuickDemo('admin');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold bg-amber-50 text-amber-800 rounded-xl border border-amber-300 text-center"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

