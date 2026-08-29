import { useState, useEffect } from 'react';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { API_URL } from '../config/api';
import { ArrowRight, Leaf, Search, Filter, Sparkles, ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
const Catalogue = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchWithCache(`${API_URL}/products`);
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const allowedTags = ['Malt', 'Atta', 'Snacks', 'Wellness'];

    const filteredCategories = categories.filter(item => {
        // robust property access
        const name = item.name || item.title || '';
        const description = item.description || item.benefit || '';
        const category = item.category || item.tag || '';

        // Global Filter: Must match one of the allowed types
        const matchesGlobal = allowedTags.some(tag =>
            name.toLowerCase().includes(tag.toLowerCase()) ||
            category.toLowerCase().includes(tag.toLowerCase()) ||
            (tag === 'Snacks' && category.toLowerCase().includes('sweets')) // Handle Snacks & Sweets
        );

        if (!matchesGlobal) return false;

        const matchesSearch =
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeFilter === 'All' ||
            (item.category && item.category === activeFilter) ||
            (item.tag && item.tag === activeFilter) ||
            (item.name && item.name.includes(activeFilter)) ||
            (activeFilter === 'Snacks' && (category.toLowerCase().includes('snacks') || category.toLowerCase().includes('sweets')));

        return matchesSearch && matchesCategory;
    });

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        hover: {
            y: -12,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    return (
        <div className="min-h-screen pt-16 md:pt-28 pb-6 md:pb-20 px-3 sm:px-8 lg:px-12 bg-[#F5F7F4] relative overflow-hidden font-sans selection:bg-organic-200 selection:text-organic-900">
            {/* Ambient Atmosphere */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-organic-300/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#E8F5E9]/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            <div className="max-w-[1440px] mx-auto z-10 relative">

                {/* Hero / Header Section - Conditionally Rendered */}
                {!searchQuery ? (
                    <div className="mb-4 md:mb-fluid-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative rounded-2xl md:rounded-fluid-2xl overflow-hidden shadow-xl md:shadow-2xl shadow-[#122A14]/20 min-h-[170px] sm:min-h-[220px] md:min-h-[clamp(280px,45vw,550px)] py-5 sm:py-8 md:py-0 flex flex-col items-center justify-center text-center group isolate bg-[#0F2411]"
                        >
                            {/* Background Image with Slow Zoom */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 z-10" />
                                <motion.img
                                    src="/catalogue-hero-premium.png"
                                    alt="Organic Farm"
                                    className="w-full h-full object-cover transition-transform duration-[20s] ease-in-out will-change-transform group-hover:scale-110"
                                />
                                {/* Rich Overlay Gradients */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0F2411]/90 via-[#0F2411]/50 to-[#0F2411]/80 mix-blend-multiply z-10" />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none" />

                                {/* Central Glow Spot */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4CAF50]/20 blur-[120px] rounded-full mix-blend-soft-light z-10 pointer-events-none" />
                            </div>

                            {/* Animated Particles / Fireflies */}
                            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 bg-[#A5D6A7] rounded-full blur-[1px] opacity-0"
                                        initial={{
                                            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                                            y: typeof window !== 'undefined' ? Math.random() * 500 : 0
                                        }}
                                        animate={{
                                            x: [null, Math.random() * 100 - 50 + "%"],
                                            y: [null, Math.random() * 100 - 50 + "%"],
                                            opacity: [0, 0.6, 0],
                                            scale: [0, 1.2, 0]
                                        }}
                                        transition={{
                                            duration: Math.random() * 10 + 15,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: Math.random() * 5
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative z-30 flex flex-col items-center px-3 max-w-4xl mx-auto mt-2 sm:mt-4 md:mt-8">
                                {/* Premium Tag */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-1.5 md:gap-fluid-sm py-1 px-2.5 md:p-fluid-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[#E8F5E9] text-[9px] md:text-fluid-xs font-bold tracking-widest uppercase shadow-lg mb-2 md:mb-fluid-md hover:bg-white/20 transition-colors cursor-default"
                                >
                                    <Sparkles className="w-3 h-3 md:w-[clamp(0.75rem,2vw,1.5rem)] md:h-[clamp(0.75rem,2vw,1.5rem)] text-[#69F0AE]" />
                                    <span>Premium Selection</span>
                                </motion.div>

                                {/* Heading */}
                                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white text-center leading-tight md:leading-[1.25] mb-3 md:mb-6 tracking-tight drop-shadow-md">
                                    <span className="block text-white mb-1">Purest of Nature,</span>
                                    <span className="font-serif italic font-light text-[#A5D6A7] relative inline-block">
                                        Delivered Fresh.
                                        <motion.svg
                                            className="absolute w-full h-3 -bottom-1 left-0 text-[#A5D6A7] opacity-60 hidden md:block"
                                            viewBox="0 0 100 10"
                                            preserveAspectRatio="none"
                                        >
                                            <motion.path
                                                d="M0 5 Q 50 10 100 5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.2, delay: 0.8 }}
                                            />
                                        </motion.svg>
                                    </span>
                                </h1>

                                {/* Subtext */}
                                <p className="text-[#E8F5E9]/90 text-[11px] sm:text-sm md:text-fluid-lg font-medium mb-2.5 md:mb-fluid-xl leading-relaxed max-w-2xl text-center mx-auto drop-shadow px-2 line-clamp-2 md:line-clamp-none">
                                    Experience the true taste of earth. Certified organic, sustainably sourced, and delivered with unconditional care.
                                </p>

                                {/* Search Bar (Hidden when searching globally, but good to keep or remove contextually - keeping for now as global finder) */}
                                <div className="w-full max-w-[260px] sm:max-w-md md:max-w-lg relative group/search">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#2E7D32] to-[#69F0AE] opacity-0 group-focus-within/search:opacity-40 blur-xl transition-all duration-500 rounded-full" />
                                    <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full p-1 pl-3 md:p-2 md:pl-6 shadow-2xl transform transition-transform group-focus-within/search:scale-[1.02]">
                                        <Search className="text-[#122A14]/40 mr-1.5 md:mr-3 w-3.5 h-3.5 md:w-5 md:h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent text-[#122A14] placeholder-[#122A14]/40 font-medium outline-none text-[11px] md:text-lg py-0.5 md:py-1 min-w-0"
                                        />
                                        <button className="bg-[#122A14] text-white p-1.5 md:p-3.5 rounded-full hover:bg-[#2E7D32] transition-all shadow-lg hover:shadow-[#2E7D32]/50 active:scale-95 flex items-center justify-center shrink-0 min-w-[28px] min-h-[28px] md:min-w-[34px] md:min-h-[34px]">
                                            <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Decor */}
                            <motion.div
                                className="absolute top-12 left-12 opacity-10 hidden md:block pointer-events-none"
                                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Leaf size={64} className="text-[#A5D6A7]" />
                            </motion.div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="mb-6 mt-4 md:mb-10 animate-fade-in-up">
                        <Link to="/catalogue" onClick={() => setSearchQuery('')} className="inline-flex items-center gap-1 text-earthy-500 hover:text-[#2E7D32] font-medium text-xs md:text-sm mb-4 transition-colors">
                            <ArrowRight className="rotate-180 w-3 h-3" /> Back to All Products
                        </Link>
                        <h1 className="text-2xl md:text-4xl font-display font-bold text-[#122A14] flex flex-wrap items-center gap-2 leading-tight">
                            <Search className="w-6 h-6 md:w-8 md:h-8 text-[#4CAF50]" />
                            <span>Results for <span className="text-[#2E7D32] italic relative inline-block">
                                "{searchQuery}"
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#A5D6A7]/50 rounded-full"></span>
                            </span></span>
                        </h1>
                        <p className="text-earthy-600 mt-2 text-sm md:text-base font-medium">Found <span className="text-[#122A14] font-bold">{filteredCategories.length}</span> items matching your search</p>

                        {filteredCategories.length === 0 && (
                            <div className="mt-12 text-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-600">No products found</h3>
                                <p className="text-gray-500 text-sm">Try searching for something else or browse our categories.</p>
                                <button onClick={() => setSearchQuery('')} className="mt-4 px-6 py-2 bg-[#122A14] text-white rounded-full text-sm font-bold hover:bg-[#2E7D32] transition-colors">
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Filters */}
                <div className="sticky top-16 md:top-24 z-30 py-0.5 md:py-4 mb-2 md:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-full px-1.5 py-1 md:px-2 md:py-2 flex overflow-x-auto gap-1.5 md:gap-2 scrollbar-hide [&::-webkit-scrollbar]:hidden max-w-full sm:max-w-max mx-auto md:mx-0">
                        <button className="hidden md:flex px-5 py-3 rounded-full hover:bg-white transition-all items-center gap-2 text-[#122A14] font-bold text-sm group">
                            <div className="bg-[#F1F8E9] p-1.5 rounded-full group-hover:bg-[#E8F5E9] transition-colors">
                                <Filter size={16} className="text-[#2E7D32]" />
                            </div>
                            <span>Filters</span>
                        </button>
                        <div className="hidden md:block w-px bg-gray-200 my-2 mx-1" />
                        {['All', 'Malt', 'Atta', 'Snacks', 'Wellness'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-2.5 py-1.5 md:px-6 md:py-3 rounded-full text-[11px] md:text-sm font-bold whitespace-nowrap transition-all duration-300 relative overflow-hidden shrink-0 min-h-[30px] md:min-h-[36px] flex items-center justify-center ${activeFilter === filter
                                    ? 'text-white shadow-lg shadow-[#2E7D32]/25'
                                    : 'text-[#455A64] hover:bg-white/80 hover:text-[#122A14]'
                                    }`}
                            >
                                {activeFilter === filter && (
                                    <motion.div layoutId="activeFilter" className="absolute inset-0 bg-[#122A14]" />
                                )}
                                <span className="relative z-10">{filter}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Immersive Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-fluid-lg"
                >
                    {filteredCategories.map((item) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="group h-full">
                            <motion.div
                                variants={cardVariants}
                                whileHover="hover"
                                layout
                                className="h-full relative bg-white rounded-2xl md:rounded-[2rem] p-2 sm:p-3 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-transparent hover:border-[#4CAF50]/10"
                            >
                                {/* Image Container with Parallax Zoom */}
                                <div className="relative h-36 sm:h-48 md:h-[clamp(200px,30vw,280px)] rounded-xl md:rounded-fluid-xl overflow-hidden bg-gray-100 mb-2 md:mb-4">
                                    <motion.img
                                        src={getOptimizedImageUrl(item.image_url || item.image, 400)}
                                        alt={item.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        layoutId={`image-${item.id}`}
                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                    />

                                    {/* Living Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Floating Badges (Pulse Animation) */}
                                    <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between items-start z-10">
                                        <div className="flex flex-col gap-2">
                                            {item.tag && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="bg-white/90 backdrop-blur-md text-[#122A14] text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-lg border border-white/20 self-start"
                                                >
                                                    {item.tag}
                                                </motion.div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(item);
                                                if (isInWishlist(item.id)) {
                                                    showToast("Removed from wishlist");
                                                } else {
                                                    showToast("Added to wishlist");
                                                }
                                            }}
                                            className={`flex w-6 h-6 sm:w-8 sm:h-8 rounded-full backdrop-blur-md border border-white/30 items-center justify-center transition-colors shadow-lg ${
                                                isInWishlist(item.id) 
                                                    ? 'bg-white text-[#E91E63]' 
                                                    : 'bg-white/40 text-white hover:bg-white hover:text-[#E91E63]'
                                            }`}
                                        >
                                            <Heart size={12} className="sm:w-4 sm:h-4" fill={isInWishlist(item.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    {/* Content within Image Area */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-5 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10 leading-tight">
                                        <p className="text-[#C8E6C9] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 md:mb-1 flex items-center gap-1">
                                            <Sparkles size={8} className="text-[#A5D6A7]" />
                                            {item.count}
                                        </p>
                                        <h3 className="text-xs sm:text-base md:text-2xl font-display font-bold text-white leading-tight md:leading-none mb-0.5 md:mb-1 group-hover:text-[#E8F5E9] transition-colors shadow-black drop-shadow-md line-clamp-1 md:line-clamp-none">
                                            {item.name}
                                        </h3>
                                        <p className="text-white/80 text-xs font-medium line-clamp-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0 hidden md:block">
                                            {item.benefit}
                                        </p>

                                        {/* Price and CTA */}
                                        <div className="flex items-center justify-between pt-1 md:pt-3 border-t border-white/20">
                                            <div>
                                                <p className="text-white/60 text-[8px] sm:text-[10px] uppercase font-bold tracking-wide">from</p>
                                                <p className="text-[#A5D6A7] font-bold text-xs sm:text-base">{item.price}</p>
                                            </div>
                                            <motion.button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(item, 1);
                                                    showToast("Added to cart");
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white text-[#122A14] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-transform duration-300"
                                            >
                                                <ShoppingBag size={12} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Catalogue;
