import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Leaf, Star, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

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
                const res = await axios.get('http://localhost:5001/api/products');
                const filtered = res.data
                    .filter(p => p.category === 'Snacks & Sweets')
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        rating: p.rating || 4.8,
                        image: p.image_url || '/placeholder-sweet.jpg',
                        category: p.sub_category || 'Others', // Assuming sub_category exists or defaulting
                        isDynamic: true
                    }));
                setProducts(filtered);
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
        <div className="min-h-screen pt-24 md:pt-28 pb-6 md:pb-20 px-4 sm:px-8 lg:px-12 bg-[#FDFCF8] relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[800px] h-[800px] bg-organic-100/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[600px] h-[600px] bg-yellow-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[1400px] mx-auto z-10 relative">

                {/* Back Link */}
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-earthy-500 hover:text-earthy-900 font-bold mb-3 md:mb-8 transition-colors text-sm md:text-base">
                    <ArrowLeft size={18} className="md:w-5 md:h-5" /> Back
                </button>

                {/* Hero Banner */}
                {/* Premium Hero Banner - Compact */}
                <div className="relative overflow-hidden bg-[#122310] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-10 mb-4 md:mb-8 shadow-[0_20px_50px_-20px_rgba(20,50,20,0.5)] border border-[#2F4F2C]">

                    {/* Animated Background Mesh & Texture */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-110 mix-blend-overlay" />

                        {/* Rich gradient background base */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#122310] via-[#1a3c1a] to-[#0d1f0d]" />

                        {/* Refined Gradient Orbs - More Vibrant & Visible */}
                        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#224422] rounded-full blur-[80px] opacity-60 translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#3a5a3a] rounded-full blur-[60px] opacity-40" />

                        {/* Golden Wave Flow - More Visible */}
                        <div className="absolute bottom-0 left-0 right-0 h-[300px] opacity-15 pointer-events-none overflow-hidden mix-blend-overlay">
                            <svg viewBox="0 0 1440 320" className="w-full h-full text-yellow-200 fill-current ml-30">
                                <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>

                        {/* Distributed Gold Particles - More Sparkle */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-[3px] h-[3px] bg-yellow-300 rounded-full opacity-0 shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                                style={{
                                    top: `${Math.random() * 80 + 10}%`,
                                    left: `${Math.random() * 90}%`,
                                }}
                                animate={{
                                    y: [0, -40, 0],
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1.5, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}

                        {/* Large Modern Geometric Accent (Right Side) */}
                        <div className="absolute top-10 right-10 w-[600px] h-[600px] border-[40px] border-white/[0.03] rounded-full pointer-events-none" />
                        <div className="absolute top-20 right-20 w-[500px] h-[500px] border-[20px] border-white/[0.03] rounded-full pointer-events-none" />

                        {/* Stylized Watermark */}
                        <div className="absolute bottom-[-2rem] left-[5%] font-serif text-[15rem] leading-none text-white/[0.03] select-none pointer-events-none italic tracking-tighter mix-blend-overlay z-0">
                            Pure
                        </div>
                    </div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                        {/* Mobile Right Side Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -10, 0], rotate: [3, 6, 3] }}
                            transition={{
                                opacity: { duration: 0.5 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute right-[4%] top-[5%] w-28 h-32 lg:hidden z-0 pointer-events-none"
                        >
                            <div className="w-full h-full rounded-[1.5rem] overflow-hidden border border-white/20 shadow-2xl rotate-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                                <img src="/featured-sweet-hero.jpg" alt="Sweet" className="w-full h-full object-cover" />
                                {/* Glass shine effect */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent opacity-50" />
                            </div>
                        </motion.div>
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-5 md:py-2 rounded-full bg-white/5 border border-white/10 text-yellow-100/90 text-[8px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase backdrop-blur-md shadow-lg shadow-black/20"
                            >
                                <Star size={8} className="text-yellow-400 fill-yellow-400 animate-pulse md:w-4 md:h-4" /> Limited Edition
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-7xl lg:text-8xl font-display font-medium text-white leading-[0.95] tracking-tight"
                            >
                                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">Heritage</span>
                                <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-400 pr-4">Sweetnezz</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-[#AABBA9] text-sm md:text-xl max-w-lg leading-relaxed font-light"
                            >
                                Handcrafted with <span className="text-white font-medium border-b border-yellow-500/30 pb-0.5">palm jaggery</span> and <span className="text-white font-medium border-b border-yellow-500/30 pb-0.5">pure ghee</span>. A royal treat for your senses, guilt-free.
                            </motion.p>

                            {/* Enhanced Search Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative max-w-lg group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-organic-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 md:p-2 backdrop-blur-xl group-focus-within:bg-white/10 group-focus-within:border-white/20 transition-all shadow-2xl">
                                    <div className="pl-4 md:pl-6 text-white/40 group-focus-within:text-yellow-400 transition-colors">
                                        <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search treats..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-white/30 px-3 py-2 md:px-4 md:py-3 focus:outline-none text-sm md:text-lg font-medium"
                                    />
                                    <button className="bg-[#D4AF37] hover:bg-[#F4C430] text-[#122310] px-4 py-1.5 md:px-8 md:py-3 rounded-full font-bold text-[10px] md:text-sm tracking-widest transition-all transform hover:scale-105 shadow-lg shadow-yellow-900/40">
                                        FIND
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Visual Right Side - More Premium Composition */}
                        <div className="hidden lg:block relative h-full min-h-[450px] perspective-1000">
                            {/* Decorative Background Pattern to fill blank space */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse-slow pointer-events-none" />
                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute right-10 top-[20%] z-20"
                            >
                                <div className="w-[300px] h-[360px] bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] relative group overflow-hidden hover:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.8)] transition-all duration-500">
                                    {/* Inner Image */}
                                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img src="/featured-sweet-hero.jpg" alt="Featured Sweet" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]" />

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#1A2E16] px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-xl z-20 flex items-center gap-1.5">
                                            <Leaf size={10} className="text-green-600" /> 100% Organic
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Background Decorative Card (Blurry) - Adjusted */}
                            <motion.div
                                animate={{ y: [0, 15, 0], rotate: [0, -4, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute right-24 top-[25%] z-10 opacity-70 scale-95"
                            >
                                <div className="w-[300px] h-[360px] bg-[#2F4F2C] rounded-[2.5rem] border border-white/5 shadow-2xl mix-blend-multiply" />
                            </motion.div>

                            {/* Extra visuals to fill space */}
                            {/* Large Decorative Leaf - Subtle Background */}
                            <div className="absolute top-[10%] right-[35%] text-white/[0.03] -rotate-12 pointer-events-none blur-[1px]">
                                <Leaf size={280} />
                            </div>

                            {/* Gold Glow */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-12 flex flex-wrap gap-3">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${activeFilter === filter
                                ? 'bg-[#1A2E16] text-white shadow-lg scale-105'
                                : 'bg-white text-earthy-600 hover:bg-organic-50 border border-earthy-100 hover:border-organic-200'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                    <AnimatePresence>
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[1.2rem] md:rounded-[2.5rem] p-2 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-organic-100/50 flex flex-col"
                            >
                                <div className="relative aspect-square rounded-[1rem] md:rounded-[2rem] overflow-hidden mb-2 md:mb-5 bg-earthy-50 group-hover:scale-[1.02] transition-transform duration-500">
                                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleWishlist(product);
                                        }}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-10 md:h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm z-10"
                                    >
                                        <Heart size={12} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={`md:w-5 md:h-5 ${isInWishlist(product.id) ? "text-red-500" : ""}`} />
                                    </button>
                                    <div className="absolute bottom-1.5 left-1.5 md:bottom-4 md:left-4 px-1.5 py-0.5 md:px-3 md:py-1 bg-white/90 backdrop-blur text-earthy-800 text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm rounded-lg">
                                        {product.category}
                                    </div>
                                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded-md flex items-center gap-0.5 md:hidden shadow-sm">
                                        <Star size={8} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-[9px] font-bold text-earthy-900">{product.rating}</span>
                                    </div>
                                </div>

                                <div className="px-1 flex-1 flex flex-col">
                                    <Link to={`/product/${product.id}`} className="block">
                                        <h3 className="text-xs md:text-xl font-bold text-earthy-900 leading-tight mb-1 md:mb-2 hover:text-organic-700 transition-colors line-clamp-2 min-h-[2.5em] md:min-h-0">{product.name}</h3>
                                    </Link>
                                    <p className="hidden md:block text-earthy-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] md:text-[10px] font-bold text-earthy-400 uppercase tracking-wider mb-0.5">Price</p>
                                            <p className="text-base md:text-2xl font-black text-organic-700">₹{product.price}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                showToast(`${product.name} added to cart!`);
                                            }}
                                            className="w-8 h-8 md:w-12 md:h-12 bg-[#1A2E16] text-white rounded-full flex items-center justify-center hover:bg-[#2F4F2C] hover:scale-110 transition-all shadow-lg shadow-organic-900/20 group-active:scale-95"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={14} className="md:w-5 md:h-5 ml-0 md:ml-[-2px]" />
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
