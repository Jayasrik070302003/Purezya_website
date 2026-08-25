import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
            const response = await axios.post('http://localhost:5001/api/auth/register', {
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
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 bg-[#FDFCF8] relative overflow-hidden font-sans selection:bg-organic-100 selection:text-organic-900">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-b from-organic-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-t from-earthy-100/60 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden border border-white/50"
            >
                {/* Left Side: Brand & Benefits */}
                <div className="lg:col-span-5 relative bg-organic-900 p-6 lg:p-10 text-white overflow-hidden flex flex-col justify-between min-h-[400px] lg:min-h-auto">
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
                            className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/10 shadow-lg"
                        >
                            <Leaf size={24} className="text-organic-300" />
                        </motion.div>

                        <h1 className="text-3xl lg:text-4xl font-display font-bold leading-[1.15] mb-4 tracking-tight">
                            Embrace the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-300 to-organic-100">Organic</span> Way
                        </h1>
                        <p className="text-organic-100/90 text-base leading-relaxed max-w-sm mb-8">
                            Join thousands of families choosing purity over process. Real food, real health, real fast.
                        </p>

                        <div className="space-y-3">
                            {benefits.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-organic-500/20 flex items-center justify-center text-organic-300 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon size={16} />
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
                            <p className="text-organic-200/80 text-xs font-semibold tracking-wider uppercase ml-2">Trusted by 50k+ Members</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-7 bg-white p-6 lg:p-10 flex items-center">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-6 text-center lg:text-left">
                            <h2 className="text-2xl lg:text-3xl font-display font-bold text-earthy-900 mb-2">Create Account</h2>
                            <p className="text-earthy-500 text-base">Sign up to start your organic journey</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium mb-4 flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Full Name"
                                    icon={User}
                                    name="name"
                                    placeholder="John Carter"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <FormInput
                                    label="Phone"
                                    icon={Phone}
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <FormInput
                                label="Email Address"
                                icon={Mail}
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Password"
                                    icon={Lock}
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <FormInput
                                    label="Confirm Password"
                                    icon={Lock}
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-organic-800 to-organic-700 hover:from-organic-900 hover:to-organic-800 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(22,101,52,0.3)] flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Complete Registration <ArrowRight size={18} /></>}
                            </motion.button>
                        </form>

                        <div className="mt-4 text-center">
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
            <label className="text-[10px] font-bold text-earthy-500 uppercase tracking-wider ml-1 group-focus-within:text-organic-600 transition-colors duration-300">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors duration-300" size={16} />
                <input
                    type={inputType}
                    required
                    className={`w-full pl-9 ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border border-earthy-200 bg-earthy-50/50 focus:bg-white focus:ring-[3px] focus:ring-organic-100 focus:border-organic-500 outline-none transition-all duration-300 font-medium text-sm text-earthy-900 placeholder:text-earthy-300`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-earthy-400 hover:text-earthy-600 focus:text-organic-600 transition-colors outline-none"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Register;
