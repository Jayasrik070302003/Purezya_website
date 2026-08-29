import { ShoppingCart, Trash2, ArrowRight, Leaf, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { API_URL } from '../config/api';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useShop();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [itemToDelete, setItemToDelete] = useState(null);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        if (cart.length === 0) {
            fetchWithCache(`${API_URL}/products?limit=3`)
                .then(data => setRecommended(data))
                .catch(err => console.error(err));
        }
    }, [cart.length]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 sm:px-8 bg-[#F9F8F6] relative overflow-hidden flex flex-col items-center justify-center font-sans">
                {/* Background Atmosphere */}
                <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg mx-auto relative z-10 mb-8 md:mb-12"
                >
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 text-organic-500 rotate-3 transition-transform hover:rotate-6 duration-500 border border-earthy-100">
                        <ShoppingCart className="opacity-80 w-10 h-10 md:w-14 md:h-14" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-earthy-900 mb-2">Your Basket is Empty</h1>
                    <p className="text-earthy-600 text-sm sm:text-base mb-6 md:mb-8 leading-relaxed px-4">
                        Your basket is waiting for some fresh, organic goodness. <br className="hidden md:block" />
                        Start shopping to fill it with healthy choices!
                    </p>
                    <Link to="/catalogue" className="inline-flex items-center gap-2 bg-[#1A2E16] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm tracking-widest hover:bg-[#2F4F2C] hover:-translate-y-0.5 transition-all shadow-lg shadow-organic-900/20">
                        START SHOPPING <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* Recommended Section */}
                {recommended.length > 0 && (
                    <div className="max-w-4xl w-full">
                        <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 opacity-60">
                            <div className="h-px bg-earthy-300 w-8 md:w-12 rounded-full" />
                            <h3 className="text-earthy-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Trending Now</h3>
                            <div className="h-px bg-earthy-300 w-8 md:w-12 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            {recommended.map(item => (
                                <Link to="/catalogue" key={item.id} className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3 group hover:shadow-md transition-all">
                                    <img src={getOptimizedImageUrl(item.image_url || item.image, 200)} alt={item.name} loading="lazy" className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover" />
                                    <div className="flex-1 min-w-0 text-left">
                                        <h4 className="font-bold text-sm text-earthy-900 group-hover:text-organic-600 transition-colors truncate">{item.name}</h4>
                                        <p className="text-xs text-earthy-500 font-medium">₹{item.price}</p>
                                    </div>
                                    <div className="bg-earthy-50 p-2 rounded-full text-earthy-400 group-hover:bg-organic-100 group-hover:text-organic-600 transition-colors">
                                        <ArrowRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 px-3 sm:px-6 md:px-8 bg-[#F9F8F6] relative overflow-x-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[700px] h-[700px] bg-organic-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            <div className="max-w-[1180px] mx-auto z-10 relative w-full">
                {/* Header Row */}
                <div className="flex flex-row items-center justify-between mb-4 md:mb-8 pb-3 md:pb-4 border-b border-earthy-200/60">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-earthy-900 tracking-tight truncate">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-600 to-organic-400">Basket</span>
                        </h1>
                        <p className="text-earthy-500 text-[11px] sm:text-sm font-medium mt-0.5 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-organic-500 inline-block animate-pulse"></span>
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="group shrink-0 flex items-center gap-1 text-red-500 hover:text-red-600 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-red-100 shadow-sm hover:shadow hover:bg-red-50/50 transition-all font-bold text-xs sm:text-sm"
                        >
                            <Trash2 size={13} className="group-hover:scale-110 transition-transform" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start w-full">
                    {/* Cart Items List */}
                    <div className="lg:col-span-7 space-y-3 sm:space-y-4 w-full min-w-0">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 shadow-sm border border-earthy-100/80 hover:border-earthy-200 transition-all flex gap-2.5 sm:gap-4 items-center w-full min-w-0"
                            >
                                {/* Product Thumbnail */}
                                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-earthy-50 border border-earthy-100 relative">
                                    <img src={getOptimizedImageUrl(item.image, 200)} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5 sm:mb-1 gap-1">
                                        <h3 className="text-xs sm:text-base md:text-lg font-bold text-earthy-900 leading-snug truncate">{item.name}</h3>
                                        <span className="text-xs sm:text-base md:text-lg font-bold text-organic-700 shrink-0 font-display">₹{item.price * item.quantity}</span>
                                    </div>

                                    {item.description && (
                                        <p className="text-earthy-400 text-[10px] sm:text-xs font-medium line-clamp-1 flex items-center gap-1 mb-1.5 sm:mb-2">
                                            <Leaf className="text-organic-500 w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                                            <span className="truncate">{item.description}</span>
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-earthy-50 text-[11px] sm:text-xs">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <span className="font-bold text-earthy-500">Qty:</span>
                                            <div className="bg-earthy-100 text-earthy-800 font-bold px-2 py-0.5 rounded-md">
                                                {item.quantity}
                                            </div>
                                            <span className="text-[10px] sm:text-[11px] text-earthy-400 font-medium truncate">(₹{item.price})</span>
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => setItemToDelete(item.id)}
                                            className="text-earthy-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 flex items-center gap-1 font-medium"
                                            title="Remove item"
                                        >
                                            <Trash2 size={13} />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary / Bill Details Card */}
                    <div className="lg:col-span-5 sticky top-24 md:top-32 w-full">
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-earthy-100 p-4 sm:p-6 md:p-7 relative overflow-hidden">
                            {/* Decorative Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-organic-500 to-emerald-400" />

                            <h2 className="text-lg sm:text-xl font-display font-bold text-earthy-900 mb-4 pb-2 border-b border-earthy-100 flex items-center justify-between">
                                <span>Bill Details</span>
                                <span className="text-xs font-sans font-semibold text-organic-700 bg-organic-50 px-2.5 py-0.5 rounded-full border border-organic-100">
                                    {cart.length} Items
                                </span>
                            </h2>

                            <div className="space-y-2.5 mb-4 text-xs sm:text-sm">
                                <div className="flex justify-between items-center text-earthy-600 font-medium">
                                    <span>Item Total</span>
                                    <span className="font-bold text-earthy-900">₹{total}</span>
                                </div>
                                <div className="flex justify-between items-center text-earthy-600 font-medium">
                                    <span>Delivery Partner Fee</span>
                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs uppercase tracking-wide border border-emerald-100">
                                        FREE
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-earthy-600 font-medium">
                                    <span>Taxes & Charges</span>
                                    <span className="text-earthy-400 font-medium italic text-xs">Included</span>
                                </div>
                            </div>

                            {/* Total Payable Box */}
                            <div className="bg-earthy-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 border border-earthy-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-earthy-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider block">Total Payable</span>
                                        <span className="text-[10px] text-organic-600 font-medium">Inclusive of all taxes</span>
                                    </div>
                                    <span className="text-2xl sm:text-3xl font-display font-bold text-earthy-900">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full group relative overflow-hidden bg-organic-700 hover:bg-organic-800 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-organic-700/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-3 flex items-center justify-center gap-1.5 text-earthy-400 text-[11px] font-medium">
                                <ShieldCheck size={14} className="text-emerald-600" />
                                <span>100% Safe & Secure SSL Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Remove Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-earthy-100"
                        >
                            <h3 className="text-lg font-display font-bold text-earthy-900 mb-1">Remove Item?</h3>
                            <p className="text-earthy-600 mb-5 text-xs sm:text-sm font-medium">Are you sure you want to remove this item from your basket?</p>
                            <div className="flex gap-2.5 justify-end">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="px-4 py-2 rounded-xl text-earthy-600 hover:bg-earthy-100 font-bold transition-colors text-xs sm:text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeFromCart(itemToDelete);
                                        setItemToDelete(null);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-colors shadow-sm text-xs sm:text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;
