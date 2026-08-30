import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Leaf, Menu, X, ChevronDown, Package, Heart, ShoppingCart, ArrowLeft, LayoutDashboard, Store, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrganicAvatar from './OrganicAvatar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-earthy-100 transition-all duration-300">
            <div className="w-full max-w-[95%] mx-auto">
                <div className="flex justify-between items-center h-[clamp(4rem,8vw,6rem)]">
                    {/* Logo Section */}
                    <Link to="/dashboard" className="flex items-center gap-4 group cursor-pointer z-50 relative">
                        <div className="relative">
                            <div className="absolute inset-0 bg-organic-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img
                                src="/asset/Purazya-logo.png"
                                alt="Purazya Logo"
                                className="h-[clamp(2.5rem,5vw,3.5rem)] w-[clamp(2.5rem,5vw,3.5rem)] rounded-full object-cover shadow-sm relative z-10 transition-transform group-hover:scale-105"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden xl:block border-l-2 border-earthy-200 pl-4"
                        >
                            <p className="font-serif font-bold text-fluid-lg text-[#2F4F2C] tracking-wide whitespace-nowrap">
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
                                        <p className="text-[10px] font-bold text-organic-600 tracking-wider mt-1">Delightful Patron ✨</p>
                                    </div>
                                    <div className="w-[clamp(2.5rem,4vw,3rem)] h-[clamp(2.5rem,4vw,3rem)] rounded-fluid-xl bg-[#14261C] flex items-center justify-center text-white border border-earthy-200 group-hover:border-organic-300 group-hover:shadow-md transition-all overflow-hidden relative">
                                        <OrganicAvatar src={user.profile_picture || user.avatar} name={user.name} />
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
                                            className="absolute right-0 top-full mt-4 w-[clamp(18rem,25vw,22rem)] bg-white/95 backdrop-blur-xl rounded-fluid-2xl shadow-[0_32px_64px_-12px_rgba(20,40,20,0.15)] border border-white/60 p-2 overflow-hidden ring-1 ring-black/5 z-50"
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
                                                onClick={handleLogoutClick}
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
                                    <div className="w-[clamp(2rem,4vw,2.5rem)] h-[clamp(2rem,4vw,2.5rem)] rounded-full overflow-hidden border border-earthy-200 group-hover/avatar:border-organic-300 transition-colors bg-[#14261C]">
                                        <OrganicAvatar src={user.profile_picture || user.avatar} name={user.name} />
                                    </div>
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                </Link>
                            )}

                            {/* Divider if User exists */}
                            {user && <div className="w-px h-6 bg-earthy-100 mx-1"></div>}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-[clamp(2.25rem,4vw,2.75rem)] h-[clamp(2.25rem,4vw,2.75rem)] flex items-center justify-center rounded-full text-earthy-700 hover:bg-earthy-50 transition-colors active:scale-95 group/menu"
                                aria-label="Toggle menu"
                            >
                                <motion.div
                                    animate={isMenuOpen ? "open" : "closed"}
                                    className="w-4 h-4 flex flex-col justify-center gap-1 items-center"
                                >
                                    <motion.span
                                        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 5 } }}
                                        className="w-4 h-0.5 bg-earthy-800 block rounded-full"
                                    />
                                    <motion.span
                                        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                                        className="w-4 h-0.5 bg-earthy-800 block rounded-full"
                                    />
                                    <motion.span
                                        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -5 } }}
                                        className="w-4 h-0.5 bg-earthy-800 block rounded-full"
                                    />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-earthy-100 shadow-xl overflow-hidden px-4 py-3"
                    >
                        <div className="flex flex-col gap-1">
                            <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="flex items-center gap-3 px-3 py-2 min-h-[42px] hover:bg-organic-50/50 rounded-xl transition-all font-bold text-earthy-800 text-sm active:scale-98">
                                <div className="w-7 h-7 rounded-full bg-organic-50 text-organic-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Home size={14} />
                                </div>
                                Home
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} to="/catalogue" className="flex items-center gap-3 px-3 py-2 min-h-[42px] hover:bg-organic-50/50 rounded-xl transition-all font-bold text-earthy-800 text-sm active:scale-98">
                                <div className="w-7 h-7 rounded-full bg-organic-50 text-organic-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Store size={14} />
                                </div>
                                Store
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} to="/cart" className="flex items-center gap-3 px-3 py-2 min-h-[42px] hover:bg-organic-50/50 rounded-xl transition-all font-bold text-earthy-800 text-sm active:scale-98">
                                <div className="w-7 h-7 rounded-full bg-organic-50 text-organic-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <ShoppingCart size={14} />
                                </div>
                                Cart
                            </Link>

                            {user && (
                                <motion.div
                                    className="space-y-1 pt-1.5 border-t border-gray-100/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center gap-3 px-3 py-2 min-h-[42px] hover:bg-organic-50/50 rounded-xl transition-all font-bold text-earthy-800 text-sm active:scale-98">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-7 h-7 rounded-full bg-[#14261C] flex items-center justify-center text-white shadow-sm border border-earthy-100 overflow-hidden">
                                                <OrganicAvatar src={user.profile_picture || user.avatar} name={user.name} />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                                        </div>
                                        My Profile
                                    </Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/orders" className="flex items-center gap-3 px-3 py-2 min-h-[42px] hover:bg-organic-50/50 rounded-xl transition-all group active:scale-98">
                                        <div className="w-7 h-7 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors shadow-sm flex-shrink-0">
                                            <Package size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-earthy-900 group-hover:text-organic-900">My Orders</span>
                                    </Link>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full py-2 min-h-[42px] mt-1 text-red-500 font-bold text-xs bg-red-50 hover:bg-red-500 hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm border border-red-100 group"
                                    >
                                        <LogOut size={14} className="group-hover:stroke-current" /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="absolute inset-0 bg-[#0F2411]/50 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-7 relative z-10 overflow-hidden border border-earthy-100 text-center"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-500" />

                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                                <LogOut size={26} />
                            </div>

                            <h3 className="text-xl font-display font-bold text-earthy-900 mb-1">Sign Out?</h3>
                            <p className="text-xs sm:text-sm text-earthy-600 mb-6 leading-relaxed">
                                Are you sure you want to end your current session? You'll need to sign back in to access your orders.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-earthy-700 bg-earthy-50 hover:bg-earthy-100 transition-all text-xs sm:text-sm border border-earthy-200"
                                >
                                    Stay
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-md shadow-red-500/25 text-xs sm:text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
