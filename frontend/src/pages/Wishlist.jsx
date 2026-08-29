import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart } = useShop();
    const { showToast } = useToast();
    const [itemToDelete, setItemToDelete] = useState(null);

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-0 -z-10 translate-y-[-20%] translate-x-[-10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg mx-auto"
                >
                    <div className="w-[clamp(4rem,10vw,6rem)] h-[clamp(4rem,10vw,6rem)] bg-red-50 rounded-full flex items-center justify-center mx-auto mb-fluid-md text-red-400">
                        <Heart className="opacity-20 w-[clamp(2rem,5vw,3rem)] h-[clamp(2rem,5vw,3rem)]" fill="currentColor" />
                    </div>
                    <h1 className="text-fluid-4xl font-display font-bold text-earthy-900 mb-fluid-sm">Your Wishlist is Empty</h1>
                    <p className="text-earthy-600 text-fluid-lg mb-fluid-xl">
                        It looks like you haven't added any organic goodies to your wishlist yet.
                        Explore our catalogue to find fresh produce you'll love!
                    </p>
                    <Link to="/catalogue" className="inline-block bg-[#1A2E16] text-[#F3F6F1] px-[clamp(1.5rem,4vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-full font-bold text-fluid-sm tracking-widest hover:bg-[#2F4F2C] transition-colors shadow-lg">
                        EXPLORE PRODUCTS
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto z-10 relative">
                <h1 className="text-fluid-3xl font-display font-bold text-earthy-900 mb-fluid-xl">Your Wishlist ({wishlist.length})</h1>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-fluid-lg">
                    {wishlist.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-fluid-2xl p-fluid-md shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col"
                        >
                            <div className="relative h-[clamp(12rem,25vw,14rem)] rounded-fluid-xl overflow-hidden mb-fluid-md bg-earthy-50">
                                <img
                                    src={item.image || item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setItemToDelete(item)}
                                    className="absolute top-3 right-3 w-9 h-9 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                    aria-label="Delete item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="px-1 flex flex-col flex-1">
                                <h3 className="text-fluid-lg font-bold text-earthy-900 leading-tight mb-1.5">{item.name}</h3>
                                <p className="text-fluid-xl font-black text-organic-700 mb-fluid-sm">₹{item.price}</p>

                                <button
                                    onClick={() => {
                                        addToCart(item);
                                        showToast(`${item.name} moved to cart!`);
                                    }}
                                    className="w-full mt-auto bg-organic-50 text-organic-800 py-2.5 px-4 rounded-fluid-lg flex items-center justify-center gap-2 font-bold text-fluid-sm hover:bg-organic-600 hover:text-white transition-colors min-h-[44px] active:scale-95 shadow-sm"
                                >
                                    <ShoppingCart size={16} />
                                    Move to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
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
                            <h3 className="text-xl font-display font-bold text-earthy-900 mb-2">Remove from Wishlist?</h3>
                            <p className="text-earthy-600 mb-6 text-sm font-medium">Are you sure you want to remove this item from your wishlist?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="px-5 py-2.5 rounded-xl text-earthy-600 hover:bg-earthy-50 font-bold transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toggleWishlist(itemToDelete);
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

export default Wishlist;
