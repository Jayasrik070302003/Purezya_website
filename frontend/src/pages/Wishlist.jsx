import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart } = useShop();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-8 lg:px-12 bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-0 -z-10 translate-y-[-20%] translate-x-[-10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg mx-auto"
                >
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-red-400">
                        <Heart size={32} fill="currentColor" className="opacity-20 md:w-12 md:h-12" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-display font-bold text-earthy-900 mb-2 md:mb-4">Your Wishlist is Empty</h1>
                    <p className="text-earthy-600 text-sm md:text-lg mb-6 md:mb-8">
                        It looks like you haven't added any organic goodies to your wishlist yet.
                        Explore our catalogue to find fresh produce you'll love!
                    </p>
                    <Link to="/catalogue" className="inline-block bg-[#1A2E16] text-[#F3F6F1] px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-xs md:text-sm tracking-widest hover:bg-[#2F4F2C] transition-colors shadow-lg">
                        EXPLORE PRODUCTS
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-8 lg:px-12 bg-[#FAF9F6] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto z-10 relative">
                <h1 className="text-4xl font-display font-bold text-earthy-900 mb-8">Your Wishlist ({wishlist.length})</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="relative h-48 rounded-[2rem] overflow-hidden mb-6 bg-earthy-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => toggleWishlist(item)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="px-2">
                                <h3 className="text-xl font-bold text-earthy-900 leading-tight mb-2">{item.name}</h3>
                                <p className="text-2xl font-black text-organic-700 mb-4">₹{item.price}</p>

                                <button
                                    onClick={() => {
                                        addToCart(item);
                                        alert('Added to cart!');
                                    }}
                                    className="w-full bg-organic-50 text-organic-800 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-organic-600 hover:text-white transition-colors"
                                >
                                    <ShoppingCart size={18} />
                                    Move to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
