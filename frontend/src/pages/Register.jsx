import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { User, Mail, Phone, Lock, Loader2, ArrowRight, Leaf, CheckCircle2, Sprout, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            return setError('All fields are required');
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        // Validate password length
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        // Validate phone number (basic validation)
        if (formData.phone.length < 10) {
            return setError('Please enter a valid phone number');
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: Sprout, text: 'Handpicked Premium Products' },
        { icon: User, text: 'Direct Farmer Partnership' },
        { icon: CheckCircle2, text: 'Zero Pesticide Guarantee' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(2rem,6vw,4rem)] bg-[#FDFCF8] relative overflow-hidden font-sans selection:bg-organic-100 selection:text-organic-900">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-b from-organic-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-t from-earthy-100/60 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md sm:max-w-lg lg:max-w-4xl z-10 grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.07)] overflow-hidden border border-earthy-100"
            >
                {/* Left Side: Brand & Benefits (Hidden on Mobile, Visible on Desktop) */}
                <div className="hidden lg:flex relative bg-organic-900 p-8 xl:p-10 text-white overflow-hidden flex-col justify-between min-h-[540px]">
                    {/* Decorative Patterns */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-5" />
                    <div className="absolute -right-20 -top-20 text-white/5 rotate-12 transform scale-150 pointer-events-none">
                        <Leaf size={400} />
                    </div>
                    <div className="absolute -left-20 -bottom-20 text-organic-400/10 -rotate-12 transform scale-150 pointer-events-none">
                        <Sprout size={400} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-[clamp(2.5rem,6vw,3rem)] h-[clamp(2.5rem,6vw,3rem)] bg-white/10 backdrop-blur-md rounded-2xl mb-fluid-md border border-white/10 shadow-lg"
                        >
                            <Leaf className="text-organic-300 w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)]" />
                        </motion.div>

                        <h1 className="text-fluid-4xl font-display font-bold leading-[1.15] mb-fluid-sm tracking-tight">
                            Embrace the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-300 to-organic-100">Organic</span> Way
                        </h1>
                        <p className="text-organic-100/90 text-fluid-base leading-relaxed max-w-sm mb-fluid-lg">
                            Join thousands of families choosing purity over process. Real food, real health, real fast.
                        </p>

                        <div className="space-y-3">
                            {benefits.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-organic-500/30 flex items-center justify-center text-organic-300 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm text-organic-50 tracking-wide">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-organic-900 bg-organic-${i * 100 + 200}`} />
                                ))}
                            </div>
                            {/* <p className="text-organic-200/80 text-xs font-semibold tracking-wider uppercase ml-2">Trusted by 50k+ Members</p> */}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-white">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-6 text-center lg:text-left">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold text-earthy-900 mb-1">Create Account</h2>
                            <p className="text-earthy-500 text-sm">Sign up to start your organic journey</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-[clamp(0.75rem,2vw,1rem)] bg-red-50 text-red-600 rounded-fluid-xl text-fluid-sm border border-red-100 font-medium mb-fluid-md flex items-center gap-fluid-sm"
                            >
                                <div className="w-[clamp(0.25rem,0.5vw,0.375rem)] h-[clamp(0.25rem,0.5vw,0.375rem)] rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <FormInput
                                label="Full Name"
                                icon={User}
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Email Address"
                                icon={Mail}
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Phone Number"
                                icon={Phone}
                                name="phone"
                                placeholder="Enter mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Password"
                                icon={Lock}
                                name="password"
                                type="password"
                                placeholder="Create password (min 6 chars)"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Confirm Password"
                                icon={Lock}
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-organic-800 to-organic-700 hover:from-organic-900 hover:to-organic-800 text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-5 text-sm active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Complete Registration <ArrowRight className="w-4 h-4" /></>}
                            </motion.button>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-earthy-500 text-sm">
                                Already have an account? {' '}
                                <Link to="/login" className="text-organic-700 font-bold hover:text-organic-800 hover:underline decoration-2 underline-offset-4 transition-all">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const FormInput = ({ label, icon: Icon, type = "text", ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-1 group">
            <label className="text-xs font-bold text-earthy-600 uppercase tracking-wider ml-1 group-focus-within:text-organic-700 transition-colors block">
                {label}
            </label>
            <div className="relative flex items-center">
                <Icon className="absolute left-3.5 text-earthy-400 group-focus-within:text-organic-600 transition-colors w-4 h-4 pointer-events-none" />
                <input
                    type={inputType}
                    required
                    className={`w-full pl-10 ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border border-earthy-200 bg-earthy-50/60 focus:bg-white focus:ring-2 focus:ring-organic-500/20 focus:border-organic-600 outline-none transition-all font-medium text-sm text-earthy-900 placeholder:text-earthy-300`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-earthy-400 hover:text-earthy-600 focus:text-organic-600 transition-colors outline-none p-1"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Register;
