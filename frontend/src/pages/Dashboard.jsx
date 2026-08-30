import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { Search, Leaf, ArrowRight, Sun, Coffee, Wheat, Candy, Utensils, HeartPulse, ShoppingCart, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { productDatabase } from '../data/products';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const Dashboard = () => {
    const { logout } = useAuth();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (term) {
            const matches = Object.values(productDatabase).filter(p => p.name.toLowerCase().includes(term));
            if (matches.length === 1) {
                navigate(`/product/${matches[0].id}`);
            } else {
                navigate(`/catalogue?search=${encodeURIComponent(searchTerm)}`);
            }
        }
    };

    useEffect(() => {
        const fetchDashboardAndProducts = async () => {
            try {
                const prodRes = await axios.get(`${API_URL}/products`);
                if (prodRes.data && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
                    setProducts(prodRes.data);
                } else {
                    setProducts(Object.values(productDatabase));
                }
            } catch (err) {
                console.warn('Using local product database fallback', err);
                setProducts(Object.values(productDatabase));
                if (err.response && err.response.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardAndProducts();
    }, [logout]);

    const hour = new Date().getHours();

    const getGreetingDetails = (h) => {
        if (h >= 5 && h < 12) return { text: 'Good Morning', icon: '🌅' };
        if (h >= 12 && h < 16) return { text: 'Good Afternoon', icon: '☀️' };
        if (h >= 16 && h < 20) return { text: 'Good Evening', icon: '🌆' };
        return { text: 'Good Night', icon: '🌙' };
    };

    const { text: greetingText, icon: greetingIcon } = getGreetingDetails(hour);

    // Featured picks: select up to 8 top products
    const featuredProducts = products.slice(0, 8);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-earthy-50">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-[3px] border-organic-100 border-t-organic-600 rounded-full"
                />
                <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-organic-600" size={24} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-16 md:pt-32 pb-12 md:pb-20 px-3 sm:px-8 lg:px-12 bg-[#FDFCF8] relative overflow-hidden font-sans">
            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Organic Background Blobs for Header */}
                <div className="absolute top-0 left-0 -z-10 translate-y-[-20%] translate-x-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-organic-100/30 to-earthy-100/30 rounded-full blur-[120px] pointer-events-none" />

                {/* Hero Banner Section */}
                <div className="relative rounded-2xl md:rounded-fluid-2xl bg-[#1a3c1e] overflow-hidden p-4 sm:p-6 md:p-fluid-xl mb-6 md:mb-fluid-2xl shadow-[0_40px_80px_-20px_rgba(20,50,20,0.4)] border border-white/10 group isolation-auto">
                    {/* Rich Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A3C1E] via-[#2D5A27] to-[#142915] z-0" />

                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {/* Central Organic Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#4ade80] rounded-full blur-[120px] opacity-10 mix-blend-screen pointer-events-none" />

                    {/* Floating Leaves */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute z-0 text-organic-300/20"
                            initial={{ x: Math.random() * 400 - 200, y: Math.random() * 400 - 200, rotate: 0 }}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, 20, 0],
                                rotate: [0, 20, -10, 0],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{
                                duration: 8 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 2
                            }}
                            style={{
                                left: `${40 + Math.random() * 20}%`,
                                top: `${20 + Math.random() * 60}%`
                            }}
                        >
                            <Leaf size={20 + Math.random() * 40} />
                        </motion.div>
                    ))}

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-fluid-lg items-center">
                        {/* Left Side: Content */}
                        <div className="lg:col-span-7 flex flex-col justify-center text-left py-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Greeting Badge */}
                                <div className="inline-flex items-center gap-2 mt-2 mb-fluid-md p-fluid-sm bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-lg ring-1 ring-white/5 mr-auto w-fit z-20 relative">
                                    <span className="animate-pulse w-[clamp(0.375rem,1vw,0.5rem)] h-[clamp(0.375rem,1vw,0.5rem)] rounded-full bg-organic-400 shadow-[0_0_10px_#4ade80]"></span>
                                    <span className="text-organic-100 text-fluid-xs font-bold uppercase tracking-[0.2em]">{hour < 12 ? 'Fresh Start' : hour < 17 ? 'Sun-Kissed' : 'Unwind'}</span>
                                </div>

                                <div className="mb-fluid-md relative text-left z-20 min-w-0">
                                    <h1 className="text-3xl sm:text-4xl md:text-fluid-4xl font-sans font-bold text-white leading-normal tracking-tight drop-shadow-sm flex flex-row items-center justify-start gap-2 sm:gap-fluid-sm mb-1 md:mb-0 flex-wrap min-w-0 py-1">
                                        <span className="shrink-0">{greetingText},</span>
                                        <motion.span
                                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="inline-block text-2xl md:text-5xl lg:text-5xl shadow-xl drop-shadow-2xl shrink-0"
                                        >
                                            {greetingIcon}
                                        </motion.span>
                                    </h1>
                                    <div className="mt-1 md:mt-2 px-0.5 min-w-0">
                                        <span className="block pt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F5E6D3] to-[#E6B800] font-serif italic font-medium tracking-wide text-4xl sm:text-5xl md:text-fluid-5xl filter drop-shadow-md opacity-100 leading-tight md:leading-normal break-words whitespace-normal min-w-0">
                                            Purazya
                                        </span>
                                    </div>
                                </div>

                                <p className="text-earthy-100 text-[11px] sm:text-sm md:text-fluid-base mb-4 md:mb-fluid-xl max-w-xl font-normal leading-relaxed opacity-90 text-left">
                                    Experience pure handcrafted organic foods nurtured by nature. 100% wholesome nutrition delivered fresh to your doorstep.
                                </p>

                                {/* Search Bar */}
                                <div className="relative max-w-xl z-20">
                                    <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1 md:p-1.5 shadow-2xl focus-within:bg-white/20 focus-within:border-white/40 transition-all">
                                        <div className="pl-3 md:pl-4 text-organic-200">
                                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search for malts, organic atta, snacks..."
                                            className="w-full bg-transparent border-none px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-fluid-sm text-white placeholder-organic-200/60 focus:outline-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="shrink-0 relative z-10 bg-gradient-to-r from-organic-500 to-organic-600 hover:from-organic-400 hover:to-organic-500 text-white w-8 h-8 md:w-[clamp(2.25rem,4vw,3.5rem)] md:h-[clamp(2.25rem,4vw,3.5rem)] min-w-[32px] min-h-[32px] md:min-w-[38px] md:min-h-[38px] rounded-full transition-all flex items-center justify-center shadow-lg hover:shadow-organic-500/50 hover:scale-105 active:scale-95 group/btn"
                                            aria-label="Search"
                                        >
                                            <ArrowRight className="w-4 h-4 md:w-[clamp(1rem,2vw,1.5rem)] md:h-[clamp(1rem,2vw,1.5rem)] transition-transform group-hover/btn:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Chips Linking Directly to Catalogue Filters */}
                                <div className="relative z-20 flex flex-nowrap md:flex-wrap items-center justify-start gap-2 md:gap-fluid-sm mt-4 md:mt-fluid-md overflow-x-auto no-scrollbar pb-1.5 w-full max-w-full scroll-smooth">
                                    {[
                                        { label: 'All Products', icon: <Sparkles size={16} />, path: '/catalogue' },
                                        { label: 'Malt Beverages', icon: <Coffee size={16} />, path: '/catalogue?category=Malt%20Beverages' },
                                        { label: 'Organic Atta', icon: <Wheat size={16} />, path: '/catalogue?category=Organic%20Atta' },
                                        { label: 'Snacks & Sweets', icon: <Candy size={16} />, path: '/catalogue?category=Snacks%20%26%20Sweets' },
                                        { label: 'Noodles & Pasta', icon: <Utensils size={16} />, path: '/catalogue?category=Noodles%20%26%20Pasta' },
                                        { label: 'Wellness', icon: <HeartPulse size={16} />, path: '/catalogue?category=Wellness%20Products' }
                                    ].map((chip, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(chip.path)}
                                            className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full md:rounded-fluid-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[#f0fdf4] text-[10px] md:text-fluid-xs font-semibold transition-all shadow-sm backdrop-blur-sm whitespace-nowrap shrink-0 min-h-[28px] md:min-h-[36px]"
                                        >
                                            <div className="opacity-80 scale-75 md:scale-100">{chip.icon}</div>
                                            <span>{chip.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Visuals */}
                        <div className="lg:col-span-5 relative h-full min-h-[140px] lg:min-h-[450px] hidden lg:flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative w-full max-w-xl z-10 mx-auto lg:mx-0"
                            >
                                <div className="absolute inset-0 bg-organic-400/30 rounded-fluid-2xl blur-3xl transform rotate-3 scale-105" />

                                <div className="relative rounded-fluid-2xl overflow-hidden shadow-[0_45px_80px_-10px_rgba(0,0,0,0.6)] border-4 border-white/10 bg-[#fdfcf8]">
                                    <img
                                        src="/asset/hero-products.jpg"
                                        alt="Purazya Organic Products"
                                        className="w-full h-auto aspect-video lg:aspect-[16/10] object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    <div className="absolute top-[clamp(0.75rem,2vw,1.5rem)] right-[clamp(0.75rem,2vw,1.5rem)] origin-top-right transform">
                                        <div className="bg-white/90 backdrop-blur-md px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full shadow-lg flex items-center gap-[clamp(0.375rem,1vw,0.5rem)]">
                                            <div className="w-[clamp(0.375rem,1vw,0.5rem)] h-[clamp(0.375rem,1vw,0.5rem)] bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-earthy-900 text-[clamp(0.625rem,1.2vw,0.75rem)] font-bold uppercase tracking-wider whitespace-nowrap">100% Certified</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-5 rounded-3xl shadow-2xl max-w-[160px] md:max-w-[200px] hidden sm:block"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                            <Sun className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-base md:text-lg leading-none">Farm</p>
                                            <p className="text-white/60 text-xs md:text-sm font-medium">To Table</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Featured Products Showcase Section */}
                <section className="mt-6 md:mt-12">
                    <div className="flex items-center justify-between mb-4 md:mb-fluid-xl border-b border-earthy-100 pb-3 md:pb-fluid-md">
                        <div>
                            <span className="text-organic-600 font-bold tracking-widest uppercase text-[10px] md:text-fluid-xs mb-0.5 md:mb-1 block">Handpicked For You</span>
                            <h2 className="text-xl sm:text-2xl md:text-fluid-3xl font-display font-bold text-earthy-900">
                                Featured Products
                            </h2>
                        </div>
                        <Link to="/catalogue" className="inline-flex items-center justify-center gap-1.5 text-organic-700 font-bold hover:text-organic-900 transition-colors group px-3.5 py-2 md:px-6 md:py-3 bg-organic-50 hover:bg-organic-100 rounded-xl md:rounded-2xl text-xs md:text-sm shrink-0 shadow-sm">
                            <span>Explore All Products</span> <ArrowRight size={14} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-fluid-lg">
                        {featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * idx }}
                                className="group relative bg-white rounded-2xl md:rounded-[1.75rem] p-2.5 sm:p-3.5 md:p-4 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-earthy-100 hover:border-organic-200"
                            >
                                {/* Product Image Container */}
                                <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 bg-earthy-50">
                                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                                        <img
                                            src={getOptimizedImageUrl(product.image_url || product.image, 400) || '/asset/hero-products.jpg'}
                                            alt={product.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/asset/hero-products.jpg';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleWishlist(product);
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 md:w-9 md:h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-earthy-700 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
                                        aria-label="Wishlist"
                                    >
                                        <Heart className={`w-4 h-4 md:w-4.5 md:h-4.5 ${isInWishlist(product.id) ? "text-red-500" : ""}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    </button>

                                    {/* Organic Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-organic-600/90 backdrop-blur text-white text-[9px] md:text-[10px] font-bold rounded-full uppercase tracking-wider pointer-events-none">
                                        100% Organic
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col flex-1">
                                    <Link to={`/product/${product.id}`} className="block mb-1">
                                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-earthy-900 leading-snug hover:text-organic-700 transition-colors line-clamp-2 min-h-[2.4em]">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="text-yellow-500 w-3.5 h-3.5" fill="currentColor" />
                                        <span className="text-xs font-bold text-earthy-700">{product.rating || 4.8}</span>
                                    </div>

                                    <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-earthy-50">
                                        <div>
                                            <span className="text-xs text-earthy-500 block leading-none">Price</span>
                                            <span className="text-sm md:text-lg font-display font-bold text-organic-700">₹{product.price}</span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                showToast(`Added ${product.name} to cart!`);
                                            }}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-organic-600 hover:bg-organic-700 text-white text-xs font-bold rounded-xl md:rounded-fluid-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                        >
                                            <ShoppingCart size={13} />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA to Catalogue */}
                    <div className="mt-8 md:mt-12 text-center">
                        <Link
                            to="/catalogue"
                            className="inline-flex items-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-[#14261C] hover:bg-[#1f3a2b] text-white text-sm md:text-base font-bold rounded-2xl md:rounded-fluid-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <span>Browse Complete Catalogue</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
