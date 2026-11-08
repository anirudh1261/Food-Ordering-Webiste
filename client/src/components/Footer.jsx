import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-amber-400 flex items-center justify-center text-white shadow-glow">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Crave<span className="text-primary-500">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Crafting unforgettable culinary journeys delivered straight to your door. Fresh ingredients, chef-crafted recipes, and lightning-fast delivery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <Instagram size={17} />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <Twitter size={17} />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <Facebook size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home Page</Link></li>
              <li><Link to="/menu" className="hover:text-primary-400 transition-colors">Explore Menu</Link></li>
              <li><a href="/#offers" className="hover:text-primary-400 transition-colors">Offers & Coupons</a></li>
              <li><Link to="/my-orders" className="hover:text-primary-400 transition-colors">Track Orders</Link></li>
              <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Top Cuisines</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/menu?category=Burgers" className="hover:text-primary-400 transition-colors">Artisan Burgers</Link></li>
              <li><Link to="/menu?category=Pizza" className="hover:text-primary-400 transition-colors">Neapolitan Pizza</Link></li>
              <li><Link to="/menu?category=Biryani%20%26%20Rice" className="hover:text-primary-400 transition-colors">Dum Biryani</Link></li>
              <li><Link to="/menu?category=Asian%20%26%20Bowls" className="hover:text-primary-400 transition-colors">Tokyo Ramen & Bowls</Link></li>
              <li><Link to="/menu?category=Desserts%20%26%20Cakes" className="hover:text-primary-400 transition-colors">Lava Cakes & Desserts</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-primary-400 shrink-0" />
                <span>450 Gourmet Lane, Food District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary-400 shrink-0" />
                <span>+1 (800) 450-CRAVE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary-400 shrink-0" />
                <span>support@cravecraft.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">Subscribe for weekly secret deals:</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to foodie deals!'); }} className="flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-l-xl focus:outline-none border border-slate-700 focus:border-primary-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-r-xl transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CraveCraft Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

