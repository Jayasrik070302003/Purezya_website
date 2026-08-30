import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Search, Leaf, ArrowRight, Sun, Sunrise, Sunset, Moon, Coffee, Wheat, Candy, Utensils, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { productDatabase } from '../data/products';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (term) {
            // Find all matching products
            const matches = Object.values(productDatabase).filter(p => p.name.toLowerCase().includes(term));

            // Intelligence: If exactly one match, go directly to it. Otherwise (0 or multiple), go to catalogue.
            if (matches.length === 1) {
                navigate(`/product/${matches[0].id}`);
            } else {
                navigate(`/catalogue?search=${encodeURIComponent(searchTerm)}`);
            }
        }
    };
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get(`${API_URL}/dashboard`);
                setData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard data');
                if (err.response && err.response.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [logout]);

    const hour = new Date().getHours();

    const getGreetingDetails = (h) => {
        if (h >= 5 && h < 12) return { text: 'Good Morning', icon: '🌅' };
        if (h >= 12 && h < 16) return { text: 'Good Afternoon', icon: '☀️' };
        if (h >= 16 && h < 20) return { text: 'Good Evening', icon: '🌆' };
        return { text: 'Good Night', icon: '🌙' };
    };

    const { text: greetingText, icon: greetingIcon } = getGreetingDetails(hour);

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

                    {/* Filling the Void: Central Organic Glow & Particles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#4ade80] rounded-full blur-[120px] opacity-10 mix-blend-screen pointer-events-none" />

                    {/* Floating Animated Leaves/Particles to fill blank space */}
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

                    {/* Floating Gold Dots (Fireflies effect) */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={`gold-dot-${i}`}
                            className="absolute z-0 w-[3px] h-[3px] bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                            initial={{ opacity: 0 }}
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
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}

                    {/* Organic Glow Effects */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4ade80] rounded-full blur-[180px] opacity-20 mix-blend-soft-light translate-x-1/3 -translate-y-1/2"
                    />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#dcfce7] rounded-full blur-[150px] opacity-10 mix-blend-overlay -translate-x-1/3 translate-y-1/3" />

                    {/* Noise Texture for Premium Feel */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                    {/* Content Grid */}
                    <div className="relative z-10 grid lg:grid-cols-12 gap-0 lg:gap-8 items-center min-w-0">
                        {/* Left Side: Text & Actions (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-center py-1 md:py-0 min-w-0">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
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
                                            {user?.name || 'Nature Lover'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[#dcfce7]/90 text-sm md:text-fluid-base mb-fluid-lg w-full max-w-none md:max-w-lg font-medium leading-relaxed text-left min-w-0 break-words">
                                    Step into your personal organic sanctuary.
                                    <span className="text-white block mt-0.5 md:mt-1">We've curated the season's finest harvest just for you.</span>
                                </p>

                                {/* Mobile Hero Image (Moved here) */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="relative w-full z-10 mr-auto mb-6 block lg:hidden"
                                >
                                    <div className="absolute inset-0 bg-organic-400/20 rounded-3xl blur-2xl transform scale-100" />
                                    <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 bg-[#fdfcf8]">
                                        <img
                                            src="/hero-products.jpg"
                                            alt="Purazya Organic Products"
                                            className="w-full h-auto aspect-[4/3] object-cover transform hover:scale-105 transition-transform duration-700"
                                        />

                                        {/* Floating Gold Dots Overlay */}
                                        {[...Array(10)].map((_, i) => (
                                            <motion.div
                                                key={`img-dot-${i}`}
                                                className="absolute z-10 w-[2px] h-[2px] bg-yellow-300 rounded-full shadow-[0_0_5px_rgba(253,224,71,0.9)]"
                                                initial={{ opacity: 0 }}
                                                animate={{
                                                    y: [0, -20, 0],
                                                    opacity: [0, 1, 0],
                                                    scale: [0, 1.5, 0]
                                                }}
                                                transition={{
                                                    duration: 2 + Math.random() * 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: Math.random() * 2
                                                }}
                                                style={{
                                                    left: `${Math.random() * 100}%`,
                                                    top: `${Math.random() * 100}%`
                                                }}
                                            />
                                        ))}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                        <div className="absolute top-3 right-3 origin-top-right transform scale-75">
                                            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-earthy-900 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">100% Certified</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Search Bar */}
                                <div className="flex justify-start w-full">
                                    <div className="group relative bg-white/10 backdrop-blur-2xl p-1 md:p-fluid-xs rounded-full md:rounded-fluid-xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2)] border border-white/20 flex items-center w-full max-w-xl transition-all duration-500 hover:bg-white/15 focus-within:bg-white/20 focus-within:shadow-[0_0_30px_rgba(74,222,128,0.2)] ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-organic-300/60 overflow-hidden">
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                                        <div className="pl-[clamp(0.5rem,2vw,1.5rem)] text-organic-200 shrink-0 transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-organic-300">
                                            <Search className="w-[clamp(1rem,2.5vw,1.5rem)] h-[clamp(1rem,2.5vw,1.5rem)]" strokeWidth={2.5} />
                                        </div>
                                        <input
                                            className="w-full px-[clamp(0.5rem,2vw,1.25rem)] py-2 md:py-[clamp(0.375rem,1.5vw,1rem)] text-xs md:text-fluid-sm text-white placeholder-organic-200/60 outline-none font-medium bg-transparent min-w-0 relative z-10"
                                            placeholder="Search products..."
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

                                {/* Quick Chips */}
                                <div className="relative z-20 flex flex-nowrap md:flex-wrap items-center justify-start gap-2 md:gap-fluid-sm mt-4 md:mt-fluid-md overflow-x-auto no-scrollbar pb-1.5 w-full max-w-full scroll-smooth">
                                    {[
                                        { label: 'Malt Beverages', icon: <Coffee size={16} />, path: '/malt-beverages' },
                                        { label: 'Organic Atta', icon: <Wheat size={16} />, path: '/organic-atta' },
                                        { label: 'Snacks & Sweets', icon: <Candy size={16} />, path: '/snacks-sweets' },
                                        { label: 'Noodles & Pasta', icon: <Utensils size={16} />, path: '/noodles-pasta' },
                                        { label: 'Wellness', icon: <HeartPulse size={16} />, path: '/wellness-products' }
                                    ].map((chip, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(chip.path)}
                                            className="flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 rounded-full md:rounded-fluid-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[#f0fdf4] text-[10px] md:text-fluid-xs font-semibold transition-all shadow-sm backdrop-blur-sm whitespace-nowrap shrink-0 min-h-[28px] md:min-h-[36px]"
                                        >
                                            <div className="opacity-80 scale-75 md:scale-100">{chip.icon}</div>
                                            <span>{chip.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Visuals (5 cols) */}
                        <div className="lg:col-span-5 relative h-full min-h-[140px] lg:min-h-[450px] hidden lg:flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
                            {/* Main Image Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative w-full max-w-xl z-10 mx-auto lg:mx-0"
                            >
                                {/* Glowing Backdrop for Image */}
                                <div className="absolute inset-0 bg-organic-400/30 rounded-fluid-2xl blur-3xl transform rotate-3 scale-105" />

                                <div className="relative rounded-fluid-2xl overflow-hidden shadow-[0_45px_80px_-10px_rgba(0,0,0,0.6)] border-4 border-white/10 bg-[#fdfcf8]">
                                    <img
                                        src="/asset/hero-products.jpg"
                                        alt="Purazya Organic Products"
                                        className="w-full h-auto aspect-video lg:aspect-[16/10] object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay Gradient on Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    {/* Floating Tag inside Image */}
                                    <div className="absolute top-[clamp(0.75rem,2vw,1.5rem)] right-[clamp(0.75rem,2vw,1.5rem)] origin-top-right transform">
                                        <div className="bg-white/90 backdrop-blur-md px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full shadow-lg flex items-center gap-[clamp(0.375rem,1vw,0.5rem)]">
                                            <div className="w-[clamp(0.375rem,1vw,0.5rem)] h-[clamp(0.375rem,1vw,0.5rem)] bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-earthy-900 text-[clamp(0.625rem,1.2vw,0.75rem)] font-bold uppercase tracking-wider whitespace-nowrap">100% Certified</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
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

                                {/* Decorative Leaves */}
                                <motion.div
                                    animate={{ rotate: [0, 10, 0], y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -top-6 -right-6 md:-top-10 md:-right-10 text-organic-300 opacity-60 pointer-events-none"
                                >
                                    <Leaf className="w-12 h-12 md:w-16 md:h-16" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Categories Section - Cinematic Grid */}
                <section className="mt-4 md:mt-12">
                    <div className="flex items-center justify-between mb-3 md:mb-fluid-xl border-b border-earthy-100 pb-2.5 md:pb-fluid-md">
                        <div>
                            <span className="text-organic-600 font-bold tracking-widest uppercase text-[10px] md:text-fluid-xs mb-0.5 md:mb-2 block">Curated For You</span>
                            <h2 className="text-lg sm:text-2xl md:text-fluid-3xl font-display font-bold text-earthy-900">
                                Explore Collections
                            </h2>
                        </div>
                        <Link to="/catalogue" className="inline-flex items-center justify-center gap-1.5 text-organic-700 font-bold hover:text-organic-900 transition-colors group px-3 py-1.5 md:px-6 md:py-3 bg-organic-50 hover:bg-organic-100 rounded-xl md:rounded-2xl text-xs md:text-sm shrink-0">
                            <span>View Catalogue</span> <ArrowRight size={14} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-fluid-lg">
                        {(data?.categories || [
                            { id: 1, name: 'Malt Beverages', image: '/asset/malt-beverage.jpg' },
                            { id: 2, name: 'Organic Atta', image: '/Product iamges/wheat-atta.jpg' },
                            { id: 3, name: 'Snacks & Sweets', image: '/asset/snacks-sweets.jpg' },
                            { id: 4, name: 'Noodles & Pasta', image: '/Product iamges/palak-noodles-premium-v2.jpg' },
                            { id: 5, name: 'Wellness Products', image: '/asset/wellness-products.jpg' }
                        ]).map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                whileHover={{ y: -6 }}
                                className="group relative h-36 sm:h-48 md:h-[clamp(280px,40vw,350px)] rounded-xl sm:rounded-2xl md:rounded-fluid-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-500"
                            >
                                <Link to={cat.id === 1 ? '/malt-beverages' : cat.id === 2 ? '/organic-atta' : cat.id === 3 ? '/snacks-sweets' : cat.id === 4 ? '/noodles-pasta' : cat.id === 5 ? '/wellness-products' : '/catalogue'} className="block w-full h-full">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity" />

                                    <div className="absolute top-2 left-2 md:top-6 md:left-6 translate-y-[-5px] md:translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
                                        <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] md:text-[10px] text-white font-bold uppercase tracking-widest border border-white/20">
                                            Premium
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 md:p-8 text-white transform transition-transform duration-500">
                                        <p className="text-xs sm:text-base md:text-2xl font-display font-bold md:font-medium leading-tight mb-0.5 md:mb-2 drop-shadow-sm">{cat.name}</p>
                                        <div className="flex items-center gap-1 md:gap-2 text-organic-200 text-[10px] md:text-sm font-semibold opacity-90 md:opacity-0 group-hover:opacity-100 transform md:translate-y-4 group-hover:translate-y-0 transition-all duration-300 md:duration-500 delay-75 md:delay-100">
                                            <span>Shop Now</span>
                                            <ArrowRight size={10} className="md:w-3.5 md:h-3.5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
export default Dashboard;
