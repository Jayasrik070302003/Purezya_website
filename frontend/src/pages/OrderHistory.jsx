import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ArrowRight, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(res.data || []);
            } catch (err) {
                console.error("Failed to fetch my orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} />;
            case 'Processing': return <Clock size={16} />;
            case 'Shipped': return <Truck size={16} />;
            default: return <Package size={16} />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const query = searchTerm.toLowerCase();
        const idMatch = String(order.id).includes(query);
        const itemMatch = (order.items || []).some(item => (item.product_name || '').toLowerCase().includes(query));
        const statusMatch = (order.status || '').toLowerCase().includes(query);
        return idMatch || itemMatch || statusMatch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
            case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden">
            <div className="max-w-4xl mx-auto z-10 relative">
                <div className="mb-fluid-xl flex flex-col md:flex-row md:items-end justify-between gap-fluid-md">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-fluid-xs text-earthy-500 hover:text-organic-700 font-bold mb-fluid-lg transition-colors text-fluid-sm">
                            <ArrowLeft className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)]" /> Back to Dashboard
                        </Link>
                        <h1 className="text-fluid-4xl font-display font-bold text-earthy-900">My Orders</h1>
                        <p className="text-earthy-500 mt-fluid-xs font-medium text-fluid-base">Track and view your past purchases.</p>
                    </div>

                    <div className="relative group w-full md:min-w-[clamp(250px,30vw,350px)]">
                        <Search className="absolute left-[clamp(1rem,2vw,1.25rem)] top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)]" />
                        <input
                            type="text"
                            placeholder="Search orders by item or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white pl-[clamp(2.5rem,4vw,3rem)] pr-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-fluid-xl border border-earthy-200 focus:border-organic-300 focus:ring-4 focus:ring-organic-100 outline-none transition-all font-medium text-earthy-700 text-fluid-sm"
                        />
                    </div>
                </div>

                <div className="space-y-fluid-lg">
                    {loading && (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-organic-600"></div>
                        </div>
                    )}
                    {filteredOrders.length === 0 && !loading && (
                        <div className="bg-white rounded-fluid-2xl p-fluid-2xl text-center border border-earthy-100 shadow-sm">
                            <div className="w-16 h-16 bg-organic-50 text-organic-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={28} />
                            </div>
                            <h3 className="text-fluid-2xl font-bold text-earthy-900 mb-2 font-display">No Orders Yet</h3>
                            <p className="text-earthy-500 text-fluid-sm max-w-md mx-auto mb-6">You haven't placed any orders yet. Explore our handcrafted, organic catalogue to find pure and nourishing essentials.</p>
                            <Link to="/catalogue" className="inline-flex items-center gap-2 bg-[#1A2E16] text-white px-6 py-3 rounded-fluid-xl font-bold text-fluid-sm hover:bg-[#2F4F2C] transition-all shadow-md active:scale-95">
                                Explore Catalogue <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                    {filteredOrders.map((order, idx) => {
                        const itemsSummary = (order.items || []).map(i => `${i.product_name} (x${i.quantity})`).join(', ') || 'Purazya organic item';
                        const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-fluid-2xl p-fluid-lg shadow-sm hover:shadow-lg border border-earthy-100 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-fluid-md justify-between items-start md:items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status || 'Confirmed'}
                                            </span>
                                            <span className="text-earthy-300 text-xs">•</span>
                                            <span className="text-earthy-500 text-xs font-medium">{orderDate}</span>
                                            <span className="text-earthy-300 text-xs">•</span>
                                            <span className="text-earthy-400 text-xs font-mono">ID: #{order.id}</span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-earthy-900 mb-1 font-display">Order #{order.id}</h3>
                                        <p className="text-earthy-500 text-xs sm:text-sm font-medium line-clamp-2">{itemsSummary}</p>
                                    </div>

                                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 border-t md:border-t-0 md:border-l border-earthy-100 pt-3 md:pt-0 md:pl-6 shrink-0">
                                        <div>
                                            <p className="text-[11px] font-bold text-earthy-400 uppercase tracking-wider">Total Paid</p>
                                            <p className="text-base sm:text-xl font-bold text-organic-700 font-display">₹{parseFloat(order.total_amount || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
