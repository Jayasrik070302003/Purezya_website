import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Background Animation Component ---
const NutsAndSeedsBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden bg-black z-0">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source src="/Orbiting_Video_Generation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Film Grain Texture for texture matching */}
            <div className="absolute inset-0 opacity-[0.05] z-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
        </div>
    );
};

// --- Login Component ---
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        const errors = {};
        if (!email.trim()) errors.email = "Required";
        if (!password) errors.password = "Required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password
            });

            console.log('Login Response:', response.data);
            const { user, token } = response.data;
            console.log('Login User Role:', user.role);

            login(user, token);

            if (user.role === 'admin') {
                console.log('Navigating to Admin Dashboard');
                navigate('/admin');
            } else {
                console.log('Navigating to User Dashboard');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 font-sans relative">
            <NutsAndSeedsBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.25)] border border-white/40 p-6 md:px-10 md:py-8 relative overflow-hidden ring-1 ring-white/60 isolation-auto">

                    {/* Decorative Elements inside Card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />

                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-6 relative z-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-3 group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-amber-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
                            <div className="relative w-20 h-20 rounded-full p-1 bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg">
                                <img
                                    src="/purezya-logo.png"
                                    alt="Purezya Life Logo"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <div className="text-center">
                            <h2 className="text-3xl font-serif text-[#1A3C28] font-medium tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-[#5C7A63] text-sm font-medium tracking-wide uppercase">Your Organic Journey Awaits</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-red-50/90 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 shadow-inner">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">

                        {/* Email Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <label className="text-[11px] font-bold text-[#4A7A45] tracking-widest uppercase">Email Address</label>
                                {fieldErrors.email && <span className="text-[11px] text-red-500 font-medium">{fieldErrors.email}</span>}
                            </div>
                            <div className="relative group transition-all duration-300">
                                <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-[#9CAFA2] group-focus-within:text-[#2F4F2C] transition-colors`}>
                                    <Mail size={20} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                                    }}
                                    className={`w-full bg-[#F5F7F5] border border-transparent focus:bg-white focus:border-[#D4C5A5]/60 hover:bg-white/80 text-[#1A2E16] text-sm rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all shadow-inner placeholder:text-[#B0C4B8] font-medium`}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-bold text-[#4A7A45] tracking-widest uppercase">Password</label>
                                <Link to="#" className="text-[11px] font-semibold text-[#D4C5A5] hover:text-[#B8A88A] transition-colors">Forgot Password?</Link>
                            </div>
                            <div className="relative group transition-all duration-300">
                                <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-[#9CAFA2] group-focus-within:text-[#2F4F2C] transition-colors`}>
                                    <Lock size={20} strokeWidth={1.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                                    }}
                                    className={`w-full bg-[#F5F7F5] border border-transparent focus:bg-white focus:border-[#D4C5A5]/60 hover:bg-white/80 text-[#1A2E16] text-sm rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all shadow-inner placeholder:text-[#B0C4B8] font-medium`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-[#9CAFA2] hover:text-[#2F4F2C] transition-colors cursor-pointer outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="text-[11px] text-red-500 font-medium px-1">{fieldErrors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#1A3B28] to-[#2E5C3E] hover:to-[#3A6B46] text-white h-12 mt-2 rounded-2xl font-serif text-lg tracking-wide shadow-lg hover:shadow-xl hover:shadow-green-900/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl" />
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span className="relative z-10 font-medium">Sign In</span>
                                    <ArrowRight size={18} className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </motion.button>

                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-[#1A3C28]/10 text-center">
                        <p className="text-[#5C7A63] text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-[#1A3C28] hover:text-[#4A7A45] transition-colors underline decoration-dotted underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default Login;
