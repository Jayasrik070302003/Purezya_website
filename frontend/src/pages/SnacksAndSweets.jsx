import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Leaf, Star, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { API_URL } from '../config/api';

const SnacksAndSweets = () => {
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchWithCache(`${API_URL}/products?category=Snacks%20%26%20Sweets`);
                const mapped = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        rating: p.rating || 4.8,
                        image: getOptimizedImageUrl(p.image_url, 400) || '/placeholder-sweet.jpg',
                        category: p.sub_category || 'Others',
                        isDynamic: true
                    }));
                setProducts(mapped);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const allProducts = products;

    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeFilter === 'All' || product.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    const filters = ['All', 'Halwa', 'Laddu'];

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(1.5rem,5vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FDFCF8] relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[800px] h-[800px] bg-organic-100/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[600px] h-[600px] bg-yellow-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[1400px] mx-auto z-10 relative">

                {/* Header */}
                <div className="mb-fluid-xl">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-fluid-xs text-earthy-500 hover:text-organic-700 font-bold mb-[clamp(0.75rem,2vw,1.5rem)] transition-colors text-fluid-base">
                        <ArrowLeft className="w-[clamp(1.125rem,1.5vw,1.25rem)] h-[clamp(1.125rem,1.5vw,1.25rem)]" /> Back
                    </button>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-display font-bold text-earthy-900 mb-fluid-sm flex flex-wrap items-center gap-fluid-sm">
                            Snacks & Sweets
                            <span className="bg-organic-100 text-organic-700 px-[clamp(0.625rem,1.5vw,1rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] rounded-full text-fluid-sm font-bold tracking-wide whitespace-nowrap">{allProducts.length} Items</span>
                        </h1>
                        <p className="text-earthy-600 text-fluid-base max-w-2xl">
                            Handcrafted organic delicacies made with pure palm jaggery, nuts, and authentic traditional recipes.
                        </p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="mb-[clamp(2rem,4vw,3rem)] flex flex-wrap gap-fluid-sm">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-[clamp(1.5rem,4vw,2rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] rounded-full font-bold text-fluid-sm tracking-wide transition-all duration-300 ${activeFilter === filter
                                ? 'bg-[#1A2E16] text-white shadow-lg scale-105'
                                : 'bg-white text-earthy-600 hover:bg-organic-50 border border-earthy-100 hover:border-organic-200'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,140px),1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-fluid-md">
                    <AnimatePresence>
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-fluid-2xl p-[clamp(0.5rem,2vw,1.25rem)] shadow-sm hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-organic-100/50 flex flex-col"
                            >
                                <div className="relative aspect-square rounded-fluid-xl overflow-hidden mb-[clamp(0.5rem,2vw,1.25rem)] bg-earthy-50 group-hover:scale-[1.02] transition-transform duration-500">
                                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleWishlist(product);
                                        }}
                                        className="absolute top-[clamp(0.5rem,1.5vw,1rem)] right-[clamp(0.5rem,1.5vw,1rem)] w-[clamp(1.5rem,3vw,2.5rem)] h-[clamp(1.5rem,3vw,2.5rem)] bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm z-10"
                                    >
                                        <Heart className={`w-[clamp(0.75rem,1.5vw,1.25rem)] h-[clamp(0.75rem,1.5vw,1.25rem)] ${isInWishlist(product.id) ? "text-red-500" : ""}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    </button>
                                    <div className="absolute bottom-[clamp(0.375rem,1vw,0.75rem)] left-[clamp(0.375rem,1vw,0.75rem)] md:bottom-[clamp(0.5rem,1.5vw,1rem)] md:left-[clamp(0.5rem,1.5vw,1rem)] px-[clamp(0.375rem,1vw,0.75rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-white/90 backdrop-blur text-earthy-800 text-[clamp(0.5rem,1vw,0.625rem)] font-black uppercase tracking-widest shadow-sm rounded-lg">
                                        {product.category}
                                    </div>
                                    <div className="absolute bottom-[clamp(0.375rem,1vw,0.75rem)] right-[clamp(0.375rem,1vw,0.75rem)] px-[clamp(0.375rem,1vw,0.5rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-white/90 backdrop-blur rounded-md flex items-center gap-0.5 md:hidden shadow-sm">
                                        <Star className="text-yellow-500 w-[clamp(0.5rem,1vw,0.75rem)] h-[clamp(0.5rem,1vw,0.75rem)]" fill="currentColor" />
                                        <span className="text-[clamp(0.5625rem,1vw,0.75rem)] font-bold text-earthy-900">{product.rating}</span>
                                    </div>
                                </div>

                                <div className="px-1 flex-1 flex flex-col">
                                    <Link to={`/product/${product.id}`} className="block">
                                        <h3 className="text-[clamp(0.75rem,2vw,1.25rem)] font-bold text-earthy-900 leading-tight mb-1 md:mb-2 hover:text-organic-700 transition-colors line-clamp-2 min-h-[2.5em] md:min-h-0">{product.name}</h3>
                                    </Link>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-[clamp(0.5rem,1vw,0.625rem)] font-bold text-earthy-400 uppercase tracking-wider mb-0.5">Price</p>
                                            <p className="text-[clamp(1rem,2.5vw,1.5rem)] font-black text-organic-700">₹{product.price}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                showToast(`${product.name} added to cart!`);
                                            }}
                                            className="w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] bg-[#1A2E16] text-white rounded-full flex items-center justify-center hover:bg-[#2F4F2C] hover:scale-110 transition-all shadow-lg shadow-organic-900/20 group-active:scale-95"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="w-[clamp(0.875rem,1.5vw,1.25rem)] h-[clamp(0.875rem,1.5vw,1.25rem)] ml-0 md:ml-[-2px]" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl text-earthy-800 font-serif italic">No delicacies found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SnacksAndSweets;
