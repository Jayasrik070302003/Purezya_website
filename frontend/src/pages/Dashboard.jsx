import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Leaf, ArrowRight, Sun } from 'lucide-react';
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
                const res = await axios.get('http://localhost:5001/api/dashboard');
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
        <div className="min-h-screen pt-20 md:pt-32 pb-20 px-4 sm:px-8 lg:px-12 bg-[#FDFCF8] relative overflow-hidden font-sans">
            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Organic Background Blobs for Header */}
                <div className="absolute top-0 left-0 -z-10 translate-y-[-20%] translate-x-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-organic-100/30 to-earthy-100/30 rounded-full blur-[120px] pointer-events-none" />

                {/* Hero Banner Section */}
                {/* Hero Banner Section */}
                {/* Hero Banner Section */}
                <div className="relative rounded-[2rem] md:rounded-[3rem] bg-[#1a3c1e] overflow-hidden p-4 md:p-10 mb-6 md:mb-20 shadow-[0_40px_80px_-20px_rgba(20,50,20,0.4)] border border-white/10 group isolation-auto">
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
                    <div className="relative z-10 grid lg:grid-cols-12 gap-0 lg:gap-8 items-center">
                        {/* Left Side: Text & Actions (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-center py-1 md:py-0">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Greeting Badge */}
                                <div className="inline-flex items-center gap-2 mt-2 mb-2 md:mb-6 px-2.5 py-1 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-lg ring-1 ring-white/5 mr-auto w-fit z-20 relative">
                                    <span className="animate-pulse w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-organic-400 shadow-[0_0_10px_#4ade80]"></span>
                                    <span className="text-organic-100 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">{hour < 12 ? 'Fresh Start' : hour < 17 ? 'Sun-Kissed' : 'Unwind'}</span>
                                </div>

                                <div className="mb-2 md:mb-6 relative text-left z-20">
                                    <h1 className="text-2xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight tracking-tight drop-shadow-sm flex flex-row items-center justify-start gap-2 md:gap-3 mb-1 md:mb-0">
                                        <span>{greetingText},</span>
                                        <motion.span
                                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="inline-block text-2xl md:text-5xl lg:text-5xl shadow-xl drop-shadow-2xl"
                                        >
                                            {greetingIcon}
                                        </motion.span>
                                    </h1>
                                    <div className="mt-1 md:mt-2 px-0.5">
                                        <span className="block pt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F5E6D3] to-[#E6B800] font-serif italic font-medium tracking-wide text-3xl md:text-5xl lg:text-6xl filter drop-shadow-md opacity-100 leading-normal">
                                            {user?.name || 'Nature Lover'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[#dcfce7]/90 text-xs md:text-lg mb-4 md:mb-8 w-full max-w-none md:max-w-lg font-medium leading-relaxed text-left">
                                    Step into your personal organic sanctuary.
                                    <span className="text-white block mt-0.5 md:mt-1">We've curated the season's finest harvest just for you.</span>
                                </p>

                                {/* Mobile Hero Image (Moved here) */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="relative w-[90%] z-10 mr-auto mb-6 block lg:hidden"
                                >
                                    <div className="absolute inset-0 bg-organic-400/20 rounded-3xl blur-2xl transform scale-100" />
                                    <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 bg-[#fdfcf8]">
                                        <img
                                            src="/hero-products.jpg"
                                            alt="Purezya Organic Products"
                                            className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-700"
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
                                    <div className="group relative bg-white/10 backdrop-blur-2xl p-1 md:p-2 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2)] border border-white/20 flex items-center w-[90%] md:w-full max-w-xl transition-all duration-500 hover:bg-white/15 focus-within:bg-white/20 focus-within:shadow-[0_0_30px_rgba(74,222,128,0.2)] ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-organic-300/60 overflow-hidden">
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                                        <div className="pl-3 md:pl-6 text-organic-200 shrink-0 transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-organic-300">
                                            <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                                        </div>
                                        <input
                                            className="w-full px-3 md:px-5 py-1.5 md:py-4 text-xs md:text-base text-white placeholder-organic-200/60 outline-none font-medium bg-transparent min-w-0 relative z-10"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="shrink-0 relative z-10 bg-gradient-to-r from-organic-500 to-organic-600 hover:from-organic-400 hover:to-organic-500 text-white w-7 h-7 md:w-14 md:h-14 rounded-full md:rounded-[1.5rem] transition-all flex items-center justify-center shadow-lg hover:shadow-organic-500/50 hover:scale-105 active:scale-95 group/btn"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5 md:w-6 md:h-6 transition-transform group-hover/btn:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Chips */}
                                <div className="relative z-20 flex flex-nowrap md:flex-wrap items-center justify-start md:justify-start gap-2 mt-3 md:mt-8 overflow-x-auto no-scrollbar pb-1.5 w-[calc(100%+32px)] md:w-auto mx-[-16px] md:mx-0 pl-4 pr-12 md:px-0 scroll-smooth max-w-[100vw]">
                                    {['🥤 Malt Beverages', '🌾 Organic Atta', '🍪 Snacks & Sweets', '🍝 Noodles & Pasta', '🧘 Wellness'].map((chip, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-2 md:px-4 py-1 md:py-2 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-[#f0fdf4] text-[7px] md:text-sm font-semibold transition-all shadow-sm backdrop-blur-sm whitespace-nowrap shrink-0"
                                        >
                                            {chip}
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
                                className="relative w-[70%] md:w-full max-w-xl z-10 mr-auto lg:mx-0"
                            >
                                {/* Glowing Backdrop for Image */}
                                <div className="absolute inset-0 bg-organic-400/30 rounded-[2.5rem] blur-3xl transform rotate-3 scale-105" />

                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_45px_80px_-10px_rgba(0,0,0,0.6)] border-4 border-white/10 bg-[#fdfcf8]">
                                    <img
                                        src="/hero-products.jpg"
                                        alt="Purezya Organic Products"
                                        className="w-full h-56 md:h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay Gradient on Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    {/* Floating Tag inside Image */}
                                    <div className="absolute top-3 right-3 md:top-6 md:right-6 origin-top-right transform scale-75 md:scale-100">
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2">
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-earthy-900 text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">100% Certified</span>
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
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-earthy-100 pb-6 gap-4">
                        <div>
                            <span className="text-organic-600 font-bold tracking-widest uppercase text-xs mb-2 block">Curated For You</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-earthy-900">
                                Explore Collections
                            </h2>
                        </div>
                        <Link to="/catalogue" className="flex items-center justify-center gap-2 text-organic-700 font-bold hover:text-organic-900 transition-colors group px-6 py-3 bg-organic-50 hover:bg-organic-100 rounded-2xl w-full md:w-auto">
                            View Catalogue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                        {data?.categories.map((cat, idx) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                whileHover={{ y: -10 }}
                                className="group relative h-[320px] rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500"
                            >
                                <Link to={cat.id === 1 ? '/malt-beverages' : cat.id === 2 ? '/organic-atta' : cat.id === 3 ? '/snacks-sweets' : cat.id === 4 ? '/noodles-pasta' : cat.id === 5 ? '/wellness-products' : '/catalogue'} className="block w-full h-full">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity" />

                                    <div className="absolute top-6 left-6 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-widest border border-white/20">
                                            Premium
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                                        <p className="text-2xl font-display font-medium mb-2">{cat.name}</p>
                                        <div className="flex items-center gap-2 text-organic-200 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            <span>Shop Now</span>
                                            <ArrowRight size={14} />
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
