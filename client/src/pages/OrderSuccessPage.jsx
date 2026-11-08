import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  MapPin, 
  Receipt, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data?.order) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.warn('Could not load specific order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  // Order timeline steps definition
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock, desc: 'We received your order' },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Restaurant accepted' },
    { key: 'Preparing', label: 'In Kitchen', icon: ChefHat, desc: 'Chef is crafting your meal' },
    { key: 'Out for Delivery', label: 'On The Way', icon: Truck, desc: 'Courier is en route' },
    { key: 'Delivered', label: 'Delivered', icon: PackageCheck, desc: 'Enjoy your food!' },
  ];

  const currentStatus = order?.orderStatus || 'Confirmed';
  const getStepStatus = (stepKey) => {
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-soft">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs animate-in zoom-in-75">
          <CheckCircle2 size={44} className="stroke-[2.2]" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Successfully Dispatched
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Order Reference ID: <strong className="text-slate-900 font-mono">#{id || order?._id}</strong>
        </p>

        {/* Live Status Tracker Stepper */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {steps.map((step) => {
              const status = getStepStatus(step.key);
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : status === 'current'
                        ? 'bg-primary-500 text-white shadow-glow ring-4 ring-primary-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <StepIcon size={20} />
                  </div>
                  <h4
                    className={`text-xs font-bold mt-2 ${
                      status === 'current' ? 'text-primary-600' : 'text-slate-800'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[100px] hidden sm:block">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Delivery Destination */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold text-slate-900">Delivery Address</h3>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p className="font-bold text-slate-800">
              {order?.deliveryAddress?.customerName || 'Customer'}
            </p>
            <p className="text-slate-500">
              {order?.deliveryAddress?.phone || 'Phone not provided'}
            </p>
            <p className="text-slate-700 leading-relaxed pt-1">
              {order?.deliveryAddress?.streetAddress || 'Address on file'}
            </p>
            {order?.deliveryAddress?.notes && (
              <p className="text-[11px] text-slate-400 italic pt-1">
                Note: "{order.deliveryAddress.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Payment & Status Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Receipt size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold text-slate-900">Payment Breakdown</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-bold text-slate-900">{order?.paymentMethod || 'Cash on Delivery'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className="font-semibold text-emerald-600">
                {order?.paymentStatus || 'Pending on Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{Number(order?.subtotal || 0).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order?.deliveryFee === 0 ? 'FREE' : `₹${Number(order?.deliveryFee || 0).toFixed(0)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Paid / Due</span>
              <span className="text-primary-600 text-sm">
                ₹{Number(order?.totalAmount || 0).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Items list */}
      {order?.items && order.items.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Items Ordered ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-400 ml-2">x{item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/my-orders"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors text-center"
        >
          View in My Orders
        </Link>
        <Link
          to="/menu"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary-500 text-white font-bold text-xs hover:bg-primary-600 transition-colors shadow-glow text-center flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={14} />
          <span>Order More Food</span>
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccessPage;

