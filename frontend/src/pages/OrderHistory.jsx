import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ArrowRight, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await axios.get('http://localhost:5001/api/products');
                setOrders([]);
            } catch (err) {
                console.error(err);
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
                            placeholder="Search orders..."
                            className="w-full bg-white pl-[clamp(2.5rem,4vw,3rem)] pr-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-fluid-xl border border-earthy-200 focus:border-organic-300 focus:ring-4 focus:ring-organic-100 outline-none transition-all font-medium text-earthy-700 text-fluid-sm"
                        />
                    </div>
                </div>

                <div className="space-y-fluid-lg">
                    {orders.length === 0 && !loading && (
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
                    {orders.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-fluid-2xl p-fluid-lg shadow-lg border border-earthy-100 hover:shadow-xl transition-all group"
                        >
                            <div className="flex flex-col md:flex-row gap-fluid-md justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-fluid-sm mb-fluid-xs">
                                        <span className={`px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] rounded-full text-[clamp(0.625rem,1vw,0.75rem)] font-bold uppercase tracking-wider flex items-center gap-[clamp(0.25rem,0.5vw,0.375rem)] ${order.statusColor}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                        <span className="text-earthy-400 text-fluid-sm font-medium">•</span>
                                        <span className="text-earthy-500 text-fluid-sm font-medium">{order.date}</span>
                                    </div>
                                    <h3 className="text-fluid-xl font-bold text-earthy-900 mb-fluid-xs">{order.id}</h3>
                                    <p className="text-earthy-500 text-fluid-sm font-medium line-clamp-1">{order.items.join(', ')}</p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-fluid-md border-t md:border-t-0 md:border-l border-earthy-100 pt-fluid-md md:pt-0 md:pl-fluid-lg">
                                    <div>
                                        <p className="text-fluid-xs font-bold text-earthy-400 uppercase tracking-wider mb-[clamp(0.125rem,0.5vw,0.25rem)]">Total</p>
                                        <p className="text-fluid-xl font-black text-earthy-900">₹{order.total}</p>
                                    </div>
                                    <button className="w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] rounded-full bg-earthy-50 flex items-center justify-center text-earthy-600 group-hover:bg-[#1A2E16] group-hover:text-white transition-all">
                                        <ArrowRight className="w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
