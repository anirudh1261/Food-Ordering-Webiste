import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleDemo = async (role) => {
    setIsSubmitting(true);
    const res = await demoLogin(role);
    setIsSubmitting(false);
    if (res.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-soft-lg p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-glow">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500">
            Enter your credentials to access your orders and favorites
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
            <Sparkles size={14} className="text-primary-600" />
            <span>Instant Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              className="px-3 py-1.5 bg-white text-slate-800 hover:text-primary-600 rounded-xl text-xs font-semibold shadow-xs border border-orange-100 transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="px-3 py-1.5 bg-amber-100/70 text-amber-900 hover:bg-amber-200 rounded-xl text-xs font-bold shadow-xs border border-amber-200 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-slate-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm shadow-glow hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Switch */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account yet? </span>
          <Link
            to="/register"
            className="font-bold text-primary-600 hover:underline"
          >
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

