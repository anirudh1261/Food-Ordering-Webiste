import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Shield, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([
    {
      _id: 'usr_1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield',
      role: 'customer',
      ordersCount: 4,
      createdAt: '2026-10-12T10:00:00Z',
    },
    {
      _id: 'usr_2',
      name: 'Sophia Martinez',
      email: 'sophia.m@gmail.com',
      phone: '+1 (555) 876-5432',
      address: '120 West 44th Street, New York, NY',
      role: 'customer',
      ordersCount: 9,
      createdAt: '2026-09-28T14:30:00Z',
    },
    {
      _id: 'usr_3',
      name: 'Marcus Chen',
      email: 'marcus.c@techcorp.io',
      phone: '+1 (555) 456-7890',
      address: '88 Market Street, San Francisco, CA',
      role: 'customer',
      ordersCount: 6,
      createdAt: '2026-10-04T08:15:00Z',
    },
    {
      _id: 'usr_admin',
      name: 'Executive Chef Admin',
      email: 'admin@foodie.com',
      phone: '+1 (800) 450-2728',
      address: 'Central Commissary HQ, Suite 100',
      role: 'admin',
      ordersCount: 0,
      createdAt: '2026-08-01T00:00:00Z',
    },
  ]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data?.users && res.data.users.length > 0) {
          setCustomers(res.data.users);
        }
      } catch (err) {
        // use default customers
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200/80">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
          User Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Registered Customers ({customers.length})
        </h1>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Contact Info</th>
                <th className="py-3 px-6">Delivery Address</th>
                <th className="py-3 px-6">Account Role</th>
                <th className="py-3 px-6">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-primary-600 font-bold flex items-center justify-center text-xs uppercase">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-slate-800">{user.phone || 'Phone not set'}</p>
                  </td>

                  <td className="py-4 px-6 max-w-xs">
                    <p className="text-slate-600 truncate">{user.address || 'No default address'}</p>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {user.role || 'customer'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminCustomers;

