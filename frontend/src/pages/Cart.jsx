import { ShoppingCart, Trash2, ArrowRight, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
            axios.get('http://localhost:5001/api/products')
                .then(res => setRecommended(res.data.slice(0, 3)))
                .catch(err => console.error(err));
        }
    }, [cart.length]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] relative overflow-hidden flex flex-col items-center justify-center font-sans">
                {/* Background Atmosphere */}
                <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg mx-auto relative z-10 mb-6 md:mb-16"
                >
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 text-organic-400 rotate-3 transition-transform hover:rotate-6 duration-500">
                        <ShoppingCart size={32} className="opacity-80 md:w-12 md:h-12" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-earthy-900 mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-earthy-900 to-earthy-600">Your Cart is Empty</h1>
                    <p className="text-earthy-600 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed px-4">
                        Your basket is waiting for some fresh, organic goodness. <br className="hidden md:block" />
                        Start shopping to fill it with healthy choices!
                    </p>
                    <Link to="/catalogue" className="inline-flex items-center gap-2 bg-[#1A2E16] text-[#F3F6F1] px-8 py-3 md:px-10 md:py-4 rounded-2xl font-bold text-xs md:text-sm tracking-widest hover:bg-[#2F4F2C] hover:-translate-y-1 transition-all shadow-xl shadow-organic-900/20">
                        START SHOPPING <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* Recommended Section (Triggers API call) */}
                {recommended.length > 0 && (
                    <div className="max-w-4xl w-full">
                        <div className="flex items-center justify-center gap-3 mb-4 md:mb-8 opacity-60">
                            <div className="h-px bg-earthy-300 w-8 md:w-12 rounded-full" />
                            <h3 className="text-earthy-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Trending Now</h3>
                            <div className="h-px bg-earthy-300 w-8 md:w-12 rounded-full" />
                        </div>
                        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto pb-4 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 snap-x snap-mandatory no-scrollbar">
                            {recommended.map(item => (
                                <Link to="/catalogue" key={item.id} className="min-w-[260px] md:min-w-0 snap-center bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3 md:gap-4 group">
                                    <img src={item.image_url || item.image} alt={item.name} className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover" />
                                    <div className="flex-1 min-w-0 text-left">
                                        <h4 className="font-bold text-sm md:text-base text-earthy-900 group-hover:text-organic-600 transition-colors truncate">{item.name}</h4>
                                        <p className="text-[10px] md:text-xs text-earthy-500 font-medium">Coming Soon</p>
                                    </div>
                                    <div className="bg-earthy-50 p-2 rounded-full text-earthy-400 group-hover:bg-organic-100 group-hover:text-organic-600 transition-colors">
                                        <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
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
        <div className="min-h-screen pt-20 md:pt-32 pb-20 px-3 sm:px-8 lg:px-12 bg-[#F9F8F6] relative overflow-hidden font-sans">
            {/* Vibrant Atmosphere */}
            <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[700px] h-[700px] bg-organic-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            {/* Texture Overlay (optional, subtle noise) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-[1200px] mx-auto z-10 relative">
                <div className="flex flex-row items-center justify-between md:items-end mb-6 md:mb-12 border-b-0 md:border-b border-earthy-200/60 pb-0 md:pb-8">
                    <div className="">
                        <h1 className="text-2xl md:text-6xl font-display font-bold text-earthy-900 mb-1 md:mb-3 tracking-tight">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-600 to-organic-400">Basket</span>
                        </h1>
                        <p className="text-earthy-500 font-medium text-xs md:text-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-organic-500 inline-block animate-pulse"></span>
                            {cart.length > 0 ? `${cart.length} items ready` : 'Basket is empty'}
                        </p>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className="shrink-0 group flex items-center gap-1.5 text-red-500 hover:text-red-600 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-white border border-red-100 shadow-sm hover:shadow-md hover:bg-red-50/50 transition-all font-bold text-[10px] md:text-sm tracking-wide uppercase">
                            <Trash2 size={11} className="md:w-[14px] md:h-[14px] group-hover:scale-110 transition-transform" />
                            CLEAR
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-6 md:gap-10 lg:gap-16 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-3 md:space-y-6">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group relative bg-white md:bg-white/80 md:backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] shadow-sm md:shadow-sm border border-gray-100 md:border-white/50 md:ring-1 md:ring-earthy-100/50 transition-all duration-300 flex gap-4 md:gap-6 items-center w-full max-w-[340px] md:max-w-full mx-auto"
                            >
                                {/* Product Image */}
                                <div className="w-16 h-16 md:w-32 md:h-32 shrink-0 rounded-xl md:rounded-[2rem] overflow-hidden bg-gray-50 relative group-hover:-rotate-2 transition-transform duration-500 ease-out border border-gray-100/50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex justify-between items-start mb-0.5 md:mb-2">
                                        <div className="flex-1 mr-2 min-w-0">
                                            <h3 className="text-sm md:text-2xl font-display font-semibold md:font-bold text-earthy-900 leading-tight md:leading-none mb-0.5 md:mb-2 truncate">{item.name}</h3>
                                            <p className="text-earthy-400 text-[10px] md:text-sm font-medium truncate flex items-center gap-1 md:gap-2">
                                                <Leaf size={10} className="text-organic-400 md:w-3 md:h-3 shrink-0" /> {item.description}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm md:text-2xl font-bold text-organic-700">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-1.5 md:mt-6 pt-0 md:pt-4 border-t-0 md:border-t md:border-dashed md:border-earthy-100">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center bg-gray-50 md:bg-white shadow-sm md:shadow-sm rounded-lg md:rounded-xl px-3 py-1 md:py-1 border border-gray-100 md:border-earthy-100 min-w-[2.5rem] md:min-w-[3rem]">
                                                <span className="text-earthy-700 font-bold text-xs md:text-base text-center">x{item.quantity}</span>
                                            </div>
                                        </div>

                                        {/* Delete Icon - Positioned naturally in flow but pushed right */}
                                        <button
                                            onClick={() => setItemToDelete(item.id)}
                                            className="text-earthy-300 hover:text-red-500 transition-colors p-1 md:p-2 hover:bg-red-50 rounded-full active:scale-95"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={13} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:col-span-4 sticky top-24 md:top-32 w-full max-w-[340px] md:max-w-full mx-auto">
                        <div className="bg-white md:bg-white/80 md:backdrop-blur-xl rounded-3xl md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 md:border-white/60 md:ring-1 md:ring-earthy-100 p-4 md:p-8 relative overflow-hidden">
                            {/* Decorative Top Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-organic-400 via-yellow-400 to-earthy-400 opacity-80 md:opacity-100" />

                            <h2 className="text-lg md:text-3xl font-display font-bold text-earthy-900 mb-3 md:mb-8 flex items-center gap-3 tracking-tight">
                                Bill Details
                                <div className="h-px flex-1 bg-gray-100 md:hidden" />
                            </h2>

                            <div className="space-y-1.5 md:space-y-4 mb-3 md:mb-8 text-sm md:text-base">
                                <div className="flex justify-between items-center text-earthy-500 md:text-earthy-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-earthy-900">₹{total}</span>
                                </div>
                                <div className="flex justify-between items-center text-earthy-500 md:text-earthy-600 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-organic-700 font-bold bg-organic-50 px-2.5 py-0.5 rounded-md text-[10px] md:text-sm uppercase tracking-wide">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-earthy-500 md:text-earthy-600 font-medium">
                                    <span>Tax</span>
                                    <span className="text-earthy-400 font-medium italic text-[10px] md:text-sm">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="bg-organic-50 p-3 -mx-1 mb-3 rounded-xl border border-organic-100 md:bg-transparent md:p-0 md:mx-0 md:mb-8 md:pt-6 md:border-0 md:border-t md:border-earthy-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-earthy-600 font-bold text-xs uppercase tracking-widest">Total Payable</span>
                                    <span className="text-2xl md:text-4xl font-display font-black text-earthy-900 tracking-tight">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full group relative overflow-hidden bg-[#152e15] text-white py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-xs md:text-base tracking-[0.2em] shadow-xl shadow-organic-900/20 hover:shadow-2xl hover:shadow-organic-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    CHECKOUT <ArrowRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform opacity-80" />
                                </span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </button>
                            <div className="mt-3 md:mt-8 flex items-center justify-center gap-2 text-earthy-400/80 text-[10px] md:text-xs font-medium tracking-wide">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 shadow-sm" /> Secure SSL Encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100"
                        >
                            <h3 className="text-xl font-display font-bold text-earthy-900 mb-2">Remove Item?</h3>
                            <p className="text-earthy-600 mb-6 text-sm font-medium">Are you sure you want to remove this item from your cart?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="px-5 py-2.5 rounded-xl text-earthy-600 hover:bg-earthy-50 font-bold transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeFromCart(itemToDelete);
                                        setItemToDelete(null);
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-colors shadow-md shadow-red-500/20 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;
