import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  XCircle,
  ArrowRight,
  MapPin,
  Receipt
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reorder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.warn('Orders fetch error or empty:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      reorder(order.items);
      navigate('/cart');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: PackageCheck };
      case 'Out for Delivery':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck };
      case 'Preparing':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: ChefHat };
      case 'Confirmed':
        return { bg: 'bg-orange-50 text-primary-700 border-orange-200', icon: CheckCircle2 };
      case 'Cancelled':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Order History
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            My Past Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time status and reorder your favorites in one click
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-glow transition-all"
        >
          <span>Order New Food</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl shadow-soft border border-slate-100 my-10">
          <div className="w-16 h-16 bg-orange-50 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Orders Yet</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            You haven't placed any food orders yet. Pick from our signature pizzas, burgers and bowls!
          </p>
          <Link
            to="/menu"
            className="px-5 py-2.5 rounded-2xl bg-primary-500 text-white text-xs font-bold shadow-glow hover:bg-primary-600 transition-colors inline-block"
          >
            Explore Today's Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.orderStatus);
            const StatusIcon = badge.icon;
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently placed';

            return (
              <div
                key={order._id || order.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-lg transition-all overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-slate-50/70 p-5 sm:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      #{order._id ? order._id.slice(-8).toUpperCase() : 'ORD-1234'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <StatusIcon size={13} />
                      <span>{order.orderStatus || 'Confirmed'}</span>
                    </div>

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-800 hover:text-primary-600 px-3 py-1 rounded-xl border border-slate-200 shadow-xs hover:border-primary-400 transition-all"
                    >
                      <RotateCcw size={13} />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>

                {/* Items & Details Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Items Thumbnails & List */}
                    <div className="md:col-span-8 space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                              />
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <p className="text-slate-400">Qty: {item.quantity} • ₹{Number(item.price).toFixed(0)} each</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right summary: Address & Total */}
                    <div className="md:col-span-4 bg-cream-50 p-4 rounded-2xl border border-orange-100/80 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Delivery To
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {order.deliveryAddress?.customerName || user?.name || 'Customer'}
                        </p>
                        <p className="text-slate-500 line-clamp-2 mt-0.5">
                          {order.deliveryAddress?.streetAddress || 'Address on record'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-orange-200/50 flex justify-between items-baseline">
                        <span className="text-slate-600 font-medium">Total Paid:</span>
                        <span className="text-base font-extrabold text-primary-600">
                          ₹{Number(order.totalAmount || 0).toFixed(0)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyOrdersPage;

