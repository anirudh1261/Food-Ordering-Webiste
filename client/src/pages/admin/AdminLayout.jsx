import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  ShoppingBag, 
  Users, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/admin/foods', label: 'Menu Products', icon: UtensilsCrossed },
    { to: '/admin/categories', label: 'Food Categories', icon: Layers },
    { to: '/admin/customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-glow">
                <UtensilsCrossed size={20} />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">
                  Crave<span className="text-primary-500">Admin</span>
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                  Management Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-glow font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Customer Site & User Snippet */}
        <div className="p-4 space-y-3 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-700/80 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Customer Website</span>
          </Link>

          <div className="p-3 rounded-2xl bg-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-amber-400 font-semibold">Master Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Store Operations
              </span>
              <h2 className="text-sm font-extrabold text-slate-900">
                Food Delivery Control Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Kitchen Online & Accepting Orders</span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={17} />
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;

