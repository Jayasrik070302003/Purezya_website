import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Leaf, Star, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { API_URL } from '../config/api';

const WellnessProducts = () => {
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchWithCache(`${API_URL}/products?category=Wellness%20Products`);
                const mapped = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        rating: p.rating || 4.9,
                        image: getOptimizedImageUrl(p.image_url, 400) || '/placeholder-well.jpg',
                        category: p.category,
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

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(1.5rem,5vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[95%] mx-auto z-10 relative">
                {/* Header */}
                <div className="mb-fluid-xl">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-fluid-xs text-earthy-500 hover:text-earthy-900 font-bold mb-[clamp(0.75rem,2vw,1.5rem)] transition-colors text-fluid-base">
                        <ArrowLeft className="w-[clamp(1.125rem,1.5vw,1.25rem)] h-[clamp(1.125rem,1.5vw,1.25rem)]" /> Back
                    </button>

                    {/* Hero Banner - Redesigned */}
                    <div className="relative overflow-hidden bg-[#14261C] rounded-fluid-2xl min-h-[clamp(12.5rem,25vw,18.75rem)] flex items-center p-[clamp(1.5rem,4vw,3rem)] mb-[clamp(1rem,3vw,3rem)] shadow-2xl shadow-[#14261C]/30 border border-white/5 group">
                        {/* 1. Dynamic Background Layers - Breathing & Alive */}
                        <motion.div
                            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-110 mix-blend-overlay pointer-events-none"
                        />

                        {/* Smoother, unified gradient flow for mobile */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#081c15] to-[#081c15] opacity-100" />

                        {/* Alive Gradient Blobs */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.5, 0.4] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[#40916c] rounded-full blur-[80px] md:blur-[140px] mix-blend-screen"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-[#2d6a4f] rounded-full blur-[60px] md:blur-[120px] opacity-30 mix-blend-screen"
                        />

                        {/* Central Highlight Heartbeat */}
                        <motion.div
                            animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-[#52b788] rounded-full blur-[90px] md:blur-[150px] -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
                        />

                        {/* 2. Existing Green Particles (Background) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={`green-${i}`}
                                    className="absolute bg-[#d8f3dc] rounded-full blur-[1px] opacity-0"
                                    style={{
                                        width: Math.random() * 3 + 1 + 'px',
                                        height: Math.random() * 3 + 1 + 'px',
                                        top: Math.random() * 100 + '%',
                                        left: Math.random() * 100 + '%'
                                    }}
                                    animate={{
                                        y: [0, -40, 0],
                                        opacity: [0, 0.3, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{
                                        duration: 5 + Math.random() * 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}

                            {/* 3. NEW: Floating Golden Dots (Foreground/Highlight) */}
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={`gold-${i}`}
                                    className="absolute bg-[#ffd700] rounded-full blur-[0.5px] opacity-0 shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                                    style={{
                                        width: Math.random() * 3 + 1 + 'px',
                                        height: Math.random() * 3 + 1 + 'px',
                                        top: Math.random() * 100 + '%',
                                        left: Math.random() * 100 + '%'
                                    }}
                                    animate={{
                                        y: [0, -60, -100],
                                        x: [0, Math.random() * 20 - 10, 0],
                                        opacity: [0, 0.8, 0],
                                        scale: [0.5, 1.2, 0]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 3,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </div>

                        {/* 4. Abstract Texture Overlay */}
                        <svg className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-plus-lighter" viewBox="0 0 400 400">
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                        </svg>

                        {/* Animated Abstract Curve Decoration */}
                        <motion.div
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 right-0 w-[80%] h-[80%] border-[20px] border-[#52b788]/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"
                        />
                        <motion.div
                            animate={{ rotate: [0, -10, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-0 left-0 w-[60%] h-[60%] border-[15px] border-[#2d6a4f]/5 rounded-full blur-lg translate-y-1/3 -translate-x-1/3"
                        />

                        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
                            <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[#A5D6A7] text-[clamp(0.625rem,1.5vw,0.875rem)] font-bold uppercase tracking-widest mb-[clamp(1rem,2vw,1.5rem)] shadow-lg"
                                >
                                    <Leaf className="text-[#69F0AE] w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)]" />
                                    <span>Ayurvedic Essentials</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-[clamp(1.875rem,6vw,4.5rem)] font-display font-bold text-white mb-[clamp(0.75rem,2vw,1.5rem)] leading-[1.1] tracking-tight"
                                >
                                    Wellness & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8E6C9] to-[#81C784] font-serif italic">Vitality</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[clamp(0.75rem,2vw,1.125rem)] text-green-100/80 leading-relaxed font-medium max-w-[clamp(20rem,40vw,32rem)] mx-auto md:mx-0"
                                >
                                    Recharge your body with nature's most potent healers. Handcrafted, preservative-free, and rooted in tradition.
                                </motion.p>
                            </div>

                            {/* Decorative Illustration Area */}
                            <div className="relative hidden md:block">
                                <div className="absolute inset-0 bg-green-500/20 blur-[80px] rounded-full" />
                                <div className="relative z-10 grid grid-cols-2 gap-4 opacity-80 mix-blend-screen">
                                    <Sparkles size={64} className="text-[#A5D6A7] animate-pulse" />
                                    <Leaf size={48} className="text-[#CDDC39] translate-y-8 rotate-12" />
                                    <Leaf size={32} className="text-[#81C784] translate-x-8 -rotate-12" />
                                    <Sparkles size={40} className="text-[#69F0AE] translate-y-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,140px),1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-fluid-md">
                    {allProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-fluid-2xl p-[clamp(0.5rem,2vw,1.5rem)] shadow-xl hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-green-100 flex flex-col"
                        >
                            <Link to={`/product/${product.id}`} className="block relative aspect-square md:aspect-auto md:h-[clamp(12rem,25vw,16rem)] rounded-fluid-xl overflow-hidden mb-[clamp(0.5rem,2vw,1.5rem)] bg-earthy-50 group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product);
                                    }}
                                    className="absolute top-[clamp(0.5rem,1.5vw,1rem)] right-[clamp(0.5rem,1.5vw,1rem)] w-[clamp(1.5rem,3vw,2.5rem)] h-[clamp(1.5rem,3vw,2.5rem)] bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm z-10"
                                >
                                    <Heart className={`w-[clamp(0.75rem,1.5vw,1.25rem)] h-[clamp(0.75rem,1.5vw,1.25rem)] ${isInWishlist(product.id) ? "text-red-500" : ""}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                </button>
                                <div className="absolute bottom-[clamp(0.375rem,1vw,0.75rem)] left-[clamp(0.375rem,1vw,0.75rem)] md:bottom-[clamp(0.5rem,1.5vw,1rem)] md:left-[clamp(0.5rem,1.5vw,1rem)] px-[clamp(0.375rem,1vw,0.75rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-white/90 backdrop-blur text-earthy-800 text-[clamp(0.5rem,1vw,0.75rem)] font-bold rounded-full uppercase tracking-widest shadow-sm">
                                    {product.category}
                                </div>
                                <div className="absolute bottom-[clamp(0.375rem,1vw,0.75rem)] right-[clamp(0.375rem,1vw,0.75rem)] px-[clamp(0.375rem,1vw,0.5rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-white/90 backdrop-blur rounded-md flex items-center gap-0.5 md:hidden shadow-sm">
                                    <Star className="text-yellow-500 w-[clamp(0.5rem,1vw,0.75rem)] h-[clamp(0.5rem,1vw,0.75rem)]" fill="currentColor" />
                                    <span className="text-[clamp(0.5625rem,1vw,0.75rem)] font-bold text-earthy-900">{product.rating}</span>
                                </div>
                            </Link>

                            <div className="px-[clamp(0.25rem,1vw,0.5rem)] flex flex-col flex-1">
                                <Link to={`/product/${product.id}`} className="block mb-[clamp(0.25rem,1vw,0.5rem)] ml-[clamp(0.25rem,1vw,0.5rem)]">
                                    <h3 className="text-[clamp(0.75rem,2vw,1.5rem)] font-bold text-earthy-900 leading-tight hover:text-green-600 transition-colors line-clamp-2 min-h-[2.5em] md:min-h-0">{product.name}</h3>
                                </Link>

                                <div className="hidden md:flex items-center gap-1 bg-yellow-50 px-fluid-sm py-fluid-xs rounded-lg w-fit mb-2">
                                    <Star className="text-yellow-500 w-[clamp(0.75rem,1vw,0.875rem)] h-[clamp(0.75rem,1vw,0.875rem)]" fill="currentColor" />
                                    <span className="text-fluid-xs font-bold text-yellow-700">{product.rating}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <div>
                                        <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-bold text-earthy-400 uppercase tracking-wider md:mb-1">Price</p>
                                        <p className="text-[clamp(1rem,2.5vw,1.5rem)] font-black text-green-700">₹{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            showToast(`${product.name} added to cart!`);
                                        }}
                                        className="bg-[#1D3325] text-white px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.25rem,1vw,0.75rem)] rounded-fluid-lg flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] font-bold hover:bg-[#2A4A35] transition-colors shadow-lg active:scale-95 text-[clamp(0.625rem,1.5vw,1rem)]"
                                    >
                                        <ShoppingCart className="w-[clamp(0.875rem,1.5vw,1.125rem)] h-[clamp(0.875rem,1.5vw,1.125rem)]" />
                                        Add
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

export default WellnessProducts;
