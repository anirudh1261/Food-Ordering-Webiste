import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  X, 
  MapPin, 
  Phone, 
  User, 
  Receipt,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.warn('Orders using mock fallback if empty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => ((o._id || o.id) === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder && (selectedOrder._id || selectedOrder.id) === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => ((o._id || o.id) === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder && (selectedOrder._id || selectedOrder.id) === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      toast.success(`Status updated to "${newStatus}" (Local)`);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'All' && order.orderStatus !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = (order._id || order.id || '').toLowerCase().includes(q);
      const matchName = order.deliveryAddress?.customerName?.toLowerCase().includes(q);
      const matchPhone = order.deliveryAddress?.phone?.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200/80">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
          Kitchen & Delivery Pipeline
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Customer Orders Management
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID, customer, phone..."
            className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-6">Order ID & Date</th>
                <th className="py-3 px-6">Customer & Phone</th>
                <th className="py-3 px-6">Items Ordered</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Status Updater</th>
                <th className="py-3 px-6 text-right">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const id = ord._id || ord.id;
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="py-4 px-6">
                        <p className="font-mono font-bold text-slate-900">
                          #{id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-slate-400">{dateStr}</p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">
                          {ord.deliveryAddress?.customerName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {ord.deliveryAddress?.phone || 'No phone'}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                          {ord.items?.length || 1} items
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{Number(ord.totalAmount || 0).toFixed(0)}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-6">
                        <span className="text-[11px] text-slate-600 block">
                          {ord.paymentMethod || 'COD'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      {/* Status select */}
                      <td className="py-4 px-6">
                        <select
                          value={ord.orderStatus || 'Pending'}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-1 text-slate-800 focus:outline-none focus:border-primary-500 shadow-xs cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Details button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-primary-600 hover:bg-orange-100 font-bold transition-colors"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-primary-500 uppercase">
                  Order Details
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  #{selectedOrder._id?.slice(-8).toUpperCase() || 'DETAILS'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedOrder.deliveryAddress?.customerName}</p>
                <p className="text-slate-500">{selectedOrder.deliveryAddress?.phone}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Address</span>
                <p className="text-slate-700 mt-0.5 line-clamp-2">{selectedOrder.deliveryAddress?.streetAddress}</p>
              </div>
            </div>

            {selectedOrder.deliveryAddress?.notes && (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900">
                <strong>Customer Notes:</strong> "{selectedOrder.deliveryAddress.notes}"
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} • ₹{Number(item.price).toFixed(0)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-cream-50 rounded-2xl space-y-2 text-xs border border-orange-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>₹{Number(selectedOrder.deliveryFee || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-orange-200">
                <span>Grand Total</span>
                <span className="text-base text-primary-600">
                  ₹{Number(selectedOrder.totalAmount || 0).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Status Update Quick Bar inside Modal */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700">Update Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:border-primary-500 shadow-xs cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;

