import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Leaf, Menu, X, ChevronDown, Package, Heart, ShoppingCart, ArrowLeft, LayoutDashboard, Store, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-earthy-100 transition-all duration-300">
            <div className="w-full max-w-[95%] mx-auto">
                <div className="flex justify-between items-center h-16 md:h-24">
                    {/* Logo Section */}
                    <Link to="/dashboard" className="flex items-center gap-4 group cursor-pointer z-50 relative">
                        <div className="relative">
                            <div className="absolute inset-0 bg-organic-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img
                                src="/purezya-logo.png"
                                alt="Purezya Life Logo"
                                className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover shadow-sm relative z-10 transition-transform group-hover:scale-105"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden xl:block border-l-2 border-earthy-200 pl-4"
                        >
                            <p className="font-serif font-bold text-lg md:text-xl text-[#2F4F2C] tracking-wide whitespace-nowrap">
                                Where purity becomes a habit.
                            </p>
                        </motion.div>
                    </Link>

                    {/* Desktop/Laptop Navigation (Visible on lg+) */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-12">
                        <Link
                            to="/wishlist"
                            className="flex items-center gap-2 text-sm font-bold text-earthy-500 hover:text-organic-700 uppercase tracking-widest transition-all relative group"
                        >
                            <Heart size={20} className="group-hover:scale-110 transition-transform" />
                            Wishlist
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-organic-500 transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            to="/cart"
                            className="flex items-center gap-2 text-sm font-bold text-earthy-500 hover:text-organic-700 uppercase tracking-widest transition-all relative group"
                        >
                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                            Cart
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-organic-500 transition-all group-hover:w-full" />
                        </Link>

                        {user ? (
                            <div className="relative ml-4 pl-8 border-l border-earthy-200">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 group outline-none"
                                >
                                    <div className="text-right hidden xl:block">
                                        <p className="text-sm font-black text-earthy-900 leading-none">{user.name}</p>
                                        <p className="text-[10px] font-bold text-organic-600 uppercase tracking-wider mt-1">Verified Member</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center text-earthy-900 border border-earthy-200 group-hover:border-organic-300 group-hover:shadow-md transition-all overflow-hidden relative">
                                        {user.profile_picture || user.avatar ? (
                                            <img src={user.profile_picture || user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} className="md:w-6 md:h-6" />
                                        )}
                                    </div>
                                    <ChevronDown className={`text-earthy-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} size={16} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(20,40,20,0.15)] border border-white/60 p-2 overflow-hidden ring-1 ring-black/5 z-50"
                                        >
                                            <div className="px-6 py-5 border-b border-gray-100/50 mb-2">
                                                <p className="text-[10px] font-black text-organic-800 uppercase tracking-widest mb-1">Signed in as</p>
                                                <p className="text-sm font-medium text-earthy-600 truncate">{user?.email}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <Link onClick={() => setIsProfileOpen(false)} to="/profile" className="flex items-center gap-4 px-6 py-3.5 text-earthy-700 hover:bg-organic-50/80 rounded-2xl transition-all group font-bold text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-organic-100 text-organic-600 flex items-center justify-center group-hover:bg-organic-600 group-hover:text-white transition-colors">
                                                        <User size={16} />
                                                    </div>
                                                    View Profile
                                                </Link>
                                                <Link onClick={() => setIsProfileOpen(false)} to="/orders" className="flex items-center gap-4 px-6 py-3.5 text-earthy-700 hover:bg-organic-50/80 rounded-2xl transition-all group font-bold text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-organic-100 text-organic-600 flex items-center justify-center group-hover:bg-organic-600 group-hover:text-white transition-colors">
                                                        <Package size={16} />
                                                    </div>
                                                    My Orders
                                                </Link>
                                            </div>

                                            <div className="h-px bg-gray-100/50 my-2 mx-4" />

                                            <button
                                                onClick={() => { setIsProfileOpen(false); logout(); }}
                                                className="w-full px-6 py-4 text-left text-red-500 hover:bg-red-50 rounded-2xl flex items-center gap-4 font-black transition-all group text-sm"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                    <LogOut size={16} />
                                                </div>
                                                SIGN OUT
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-8">
                                <Link to="/login" className="px-6 py-2.5 rounded-full font-bold text-earthy-600 hover:bg-earthy-50 transition-colors">Log In</Link>
                                <Link to="/register" className="px-6 py-2.5 rounded-full font-bold bg-[#1A2E16] text-white shadow-lg hover:bg-[#2F4F2C] hover:shadow-xl transition-all">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button (Visible on md and below) */}
                    <div className="lg:hidden flex items-center">
                        <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full p-1 pl-1.5 border border-earthy-100 shadow-sm gap-1 ring-1 ring-black/5">
                            {/* Mobile User Icon */}
                            {user && (
                                <Link to="/profile" className="relative group/avatar">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-earthy-200 group-hover/avatar:border-organic-300 transition-colors">
                                        <img src={user.profile_picture || user.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&q=80"} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                </Link>
                            )}

                            {/* Divider if User exists */}
                            {user && <div className="w-px h-6 bg-earthy-100 mx-1"></div>}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-earthy-700 hover:bg-earthy-50 transition-colors active:scale-95 group/menu"
                                aria-label="Toggle menu"
                            >
                                <motion.div
                                    animate={isMenuOpen ? "open" : "closed"}
                                    variants={{
                                        open: { rotate: 90 },
                                        closed: { rotate: 0 }
                                    }}
                                >
                                    {isMenuOpen ? <X size={20} className="group-hover/menu:text-organic-600 transition-colors" /> : <Menu size={20} className="group-hover/menu:text-organic-600 transition-colors" />}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="lg:hidden absolute top-20 right-4 left-auto w-[260px] bg-white/95 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] border border-white/60 z-40 overflow-hidden ring-1 ring-black/5 pb-2"
                    >
                        <div className="p-2 space-y-1">
                            <motion.div
                                className="space-y-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <p className="text-[10px] font-black text-earthy-300 uppercase tracking-[0.25em] mb-0.5 pl-3">Navigation</p>
                                <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                    <div className="w-7 h-7 rounded-full bg-organic-50 text-organic-600 flex items-center justify-center group-hover:bg-organic-600 group-hover:text-white transition-colors shadow-sm">
                                        <Home size={14} />
                                    </div>
                                    <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">Home</span>
                                </Link>
                                <Link onClick={() => setIsMenuOpen(false)} to="/catalogue" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                    <div className="w-7 h-7 rounded-full bg-organic-50 text-organic-600 flex items-center justify-center group-hover:bg-organic-600 group-hover:text-white transition-colors shadow-sm">
                                        <Store size={14} />
                                        {/* Optional "Premium" Tag inline if needed, simplified for clean menu */}
                                    </div>
                                    <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">Catalogue</span>
                                </Link>
                                <Link onClick={() => setIsMenuOpen(false)} to="/wishlist" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                    <div className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors shadow-sm">
                                        <Heart size={14} />
                                    </div>
                                    <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">Wishlist</span>
                                </Link>
                                <Link onClick={() => setIsMenuOpen(false)} to="/cart" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                                        <ShoppingCart size={14} />
                                    </div>
                                    <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">Cart</span>
                                </Link>
                            </motion.div>

                            {user && (
                                <motion.div
                                    className="space-y-1 pt-1.5 border-t border-gray-100/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-[10px] font-black text-earthy-300 uppercase tracking-[0.25em] mb-0.5 pl-3">Account</p>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                        <div className="relative">
                                            <div className="w-7 h-7 rounded-full bg-earthy-50 flex items-center justify-center text-organic-600 shadow-sm border border-earthy-100 overflow-hidden">
                                                {(user.profile_picture || user.avatar) ? <img src={user.profile_picture || user.avatar} className="w-full h-full object-cover" /> : <User size={14} />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-earthy-900 text-sm">My Profile</span>
                                            <span className="text-[10px] text-earthy-500 font-medium truncate max-w-[140px]">{user.email}</span>
                                        </div>
                                    </Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/orders" className="flex items-center gap-3 px-3 py-1 hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                        <div className="w-7 h-7 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors shadow-sm">
                                            <Package size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">My Orders</span>
                                    </Link>

                                    <button
                                        onClick={() => { setIsMenuOpen(false); logout(); }}
                                        className="w-full py-1.5 mt-1 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm border border-red-100 group"
                                    >
                                        <LogOut size={14} className="group-hover:stroke-current" /> Sign Out
                                    </button>
                                </motion.div>
                            )}

                            {!user && (
                                <motion.div
                                    className="grid grid-cols-2 gap-3 mt-1 pt-1.5 border-t border-gray-100/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link onClick={() => setIsMenuOpen(false)} to="/login" className="w-full py-1.5 text-center font-bold text-earthy-600 bg-earthy-50 hover:bg-earthy-100 rounded-2xl text-xs transition-colors border border-earthy-200">Log In</Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/register" className="w-full py-1.5 text-center font-bold text-white bg-[#1A2E16] hover:bg-[#2F4F2C] rounded-2xl shadow-lg shadow-organic-900/20 text-xs transition-all">Sign Up</Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
