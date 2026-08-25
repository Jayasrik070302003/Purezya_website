import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User, ShieldCheck, Truck, Mail, Smartphone, Clock } from 'lucide-react';

const Checkout = () => {
    const { cart, createOrder, clearCart } = useShop();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock shipping details state
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [formData, setFormData] = useState({
        firstName: 'Jayasri',
        lastName: '',
        email: 'jayasri@example.com',
        mobile: '9876543210',
        pincode: '600001',
        address: '123 Organic Street, Green Valley'
    });
    const [paymentMethod, setPaymentMethod] = useState('card');

    // UPI State
    const [selectedUpiApp, setSelectedUpiApp] = useState(null);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (selectedUpiApp && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [selectedUpiApp, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUpiAppSelect = (app) => {
        setSelectedUpiApp(app);
        setTimer(300); // Reset timer on app switch
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                totalAmount: total,
                status: 'Confirmed',
                paymentMethod: paymentMethod, // Include payment method
                shippingDetails: formData
            };

            await createOrder(orderData);
            clearCart();
            showToast('Order placed successfully! 🎉');
            navigate('/orders');
        } catch (error) {
            console.error(error);
            showToast('Payment failed. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
                <p>Redirecting to cart...</p>
                {setTimeout(() => navigate('/cart'), 0)}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-10 md:pb-20 px-3 md:px-12 bg-[#F9F8F6] relative overflow-hidden font-sans">
            {/* Vibrant Atmosphere */}
            <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[700px] h-[700px] bg-organic-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[600px] h-[600px] bg-yellow-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <button onClick={() => navigate('/cart')} className="group flex items-center gap-1.5 md:gap-2 text-earthy-500 hover:text-earthy-900 font-bold mb-4 md:mb-8 transition-colors text-xs md:text-base">
                    <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </button>

                <h1 className="text-2xl md:text-5xl font-display font-bold text-earthy-900 mb-6 md:mb-10 flex items-center gap-2 md:gap-4">
                    Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-600 to-organic-400">Checkout</span>
                    <ShieldCheck size={24} className="text-organic-500 md:w-8 md:h-8" />
                </h1>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left Column: Form/Steps */}
                    <div className="lg:col-span-7 space-y-6">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border transition-all duration-500 ${step === 1 ? 'border-organic-500 ring-1 ring-organic-200 shadow-xl' : 'border-white/50 opacity-60'}`}
                        >
                            <h2 className="text-lg md:text-xl font-display font-bold text-earthy-900 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all ${step === 1 ? 'bg-organic-600 text-white shadow-organic-200 shadow-lg' : 'bg-organic-600 text-white'}`}>
                                    {step > 1 ? <CheckCircle size={16} /> : 'Step 1'}
                                </span>
                                Shipping Details
                            </h2>

                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 md:space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-3 md:gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">First Name</label>
                                                <div className="relative group">
                                                    <User size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                    <input
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-4 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm placeholder:text-earthy-300"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">Last Name</label>
                                                <div className="relative group">
                                                    <User size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                    <input
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        placeholder="(Optional)"
                                                        className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-4 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm placeholder:text-earthy-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-4 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm placeholder:text-earthy-300"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 md:gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">Mobile Number</label>
                                                <div className="relative group">
                                                    <Phone size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                    <input
                                                        type="tel"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-4 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm placeholder:text-earthy-300"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">Pin Code</label>
                                                <div className="relative group">
                                                    <MapPin size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                    <input
                                                        type="text"
                                                        value={formData.pincode}
                                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                        className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-4 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm placeholder:text-earthy-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wider ml-1">Delivery Address</label>
                                            <div className="relative group">
                                                <MapPin size={16} className="absolute left-3 md:left-4 top-3.5 md:top-4 text-earthy-400 group-focus-within:text-organic-600 transition-colors md:w-[18px] md:h-[18px]" />
                                                <textarea
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full bg-white rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-5 py-2.5 md:py-3 border border-earthy-200 focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-50 font-medium text-xs md:text-base text-earthy-900 transition-all shadow-sm resize-none placeholder:text-earthy-300 break-all leading-relaxed no-scrollbar"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setStep(2)}
                                            className="mt-4 md:mt-6 w-full bg-earthy-900 text-white px-6 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-base tracking-wide hover:bg-earthy-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 group"
                                        >
                                            Continue to Payment <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-between items-start md:items-center bg-white/50 rounded-xl md:rounded-2xl p-3 md:p-6 border border-earthy-100"
                                    >
                                        <div className="space-y-1 md:space-y-1.5">
                                            <p className="font-bold text-earthy-900 text-sm md:text-lg flex items-center gap-1.5 md:gap-2">
                                                <User size={14} className="text-organic-600 md:w-4 md:h-4" />
                                                {formData.firstName} {formData.lastName}
                                            </p>
                                            <p className="text-earthy-600 text-[10px] md:text-sm flex items-center gap-1.5 md:gap-2 pl-5 md:pl-6 leading-tight">
                                                <span className="text-organic-600 font-medium">contact:</span> {formData.mobile}
                                            </p>
                                            <p className="text-earthy-600 text-[10px] md:text-sm flex items-center gap-1.5 md:gap-2 pl-5 md:pl-6 leading-tight">
                                                <span className="text-organic-600 font-medium">email:</span> {formData.email}
                                            </p>
                                            <p className="text-earthy-600 text-[10px] md:text-sm flex items-start gap-1.5 md:gap-2 pl-5 md:pl-6 leading-tight">
                                                <span className="text-organic-600 font-medium shrink-0">to:</span>
                                                <span className="line-clamp-2">{formData.address}, {formData.pincode}</span>
                                            </p>
                                        </div>
                                        <button onClick={() => setStep(1)} className="px-3 py-1.5 md:px-5 md:py-2.5 bg-white border border-earthy-200 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-organic-700 hover:bg-organic-50 transition-colors shadow-sm shrink-0 ml-2">
                                            Edit
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Step 2: Payment */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border transition-all duration-500 ${step === 2 ? 'border-organic-500 ring-1 ring-organic-200 shadow-xl' : 'border-white/50 opacity-60'}`}
                        >
                            <h2 className="text-lg md:text-xl font-display font-bold text-earthy-900 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${step === 2 ? 'bg-organic-600 text-white shadow-organic-200 shadow-lg' : 'bg-earthy-100 text-earthy-500'}`}>
                                    Step 2
                                </span>
                                Payment Method
                            </h2>

                            <AnimatePresence>
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            {/* Helper Text */}
                                            <p className="text-earthy-500 text-sm font-medium ml-1">Select your preferred payment mode</p>

                                            {/* Option 1: Card */}
                                            <label className="relative block cursor-pointer group mb-4">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={() => setPaymentMethod('card')}
                                                    className="peer sr-only"
                                                />
                                                <div className={`p-4 md:p-6 bg-gradient-to-br from-white to-organic-50/30 border-2 rounded-2xl md:rounded-3xl transition-all duration-300 shadow-md relative overflow-hidden ${paymentMethod === 'card' ? 'border-organic-500 shadow-organic-100 ring-2 md:ring-4 ring-organic-50' : 'border-earthy-100 hover:border-organic-200'}`}>

                                                    {/* Header Row */}
                                                    <div className="flex items-start justify-between mb-3 md:mb-4">
                                                        <div className="flex items-center gap-3 md:gap-4">
                                                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner transition-colors ${paymentMethod === 'card' ? 'bg-organic-100 text-organic-600' : 'bg-earthy-50 text-earthy-400'}`}>
                                                                <CreditCard size={20} className="md:w-7 md:h-7" />
                                                            </div>
                                                            <div>
                                                                <p className="font-display font-bold text-earthy-900 text-sm md:text-lg leading-tight">Credit / Debit Card</p>
                                                                <p className="text-[10px] md:text-sm font-medium text-organic-600">Secure payment via Stripe</p>
                                                            </div>
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {paymentMethod === 'card' && (
                                                            <div className="w-8 h-8 rounded-full bg-organic-500 text-white flex items-center justify-center shadow-lg transform scale-100 transition-transform duration-300">
                                                                <CheckCircle size={18} fill="currentColor" className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Trust Badges / Info */}
                                                    <div className="space-y-2 md:space-y-3 pl-2 md:pl-[4.5rem]">
                                                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-4">
                                                            {['Visa', 'Mastercard', 'RuPay'].map(brand => (
                                                                <div key={brand} className="px-2 py-0.5 md:px-3 md:py-1 bg-white border border-earthy-100 rounded md:rounded-lg text-[10px] md:text-xs font-bold text-earthy-600 shadow-sm">
                                                                    {brand}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs font-medium text-earthy-500">
                                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                                <ShieldCheck size={12} className="text-organic-500 md:w-[14px] md:h-[14px]" />
                                                                <span>256-bit SSL encrypted transactions</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                                <ShieldCheck size={12} className="text-organic-500 md:w-[14px] md:h-[14px]" />
                                                                <span>PCI-DSS compliant payment gateway</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-organic-500 flex items-center justify-center text-organic-500 text-[8px] font-bold">↺</div>
                                                                <span>Easy refund & cancellation support</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Subtle Glow Effect */}
                                                    {paymentMethod === 'card' && (
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-organic-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                                    )}
                                                </div>
                                            </label>

                                            {/* Option 2: UPI */}
                                            <div className="relative group mb-4">
                                                {/* Header to toggle UPI selection */}
                                                <div
                                                    onClick={() => setPaymentMethod('upi')}
                                                    className={`cursor-pointer p-6 bg-gradient-to-br from-white to-organic-50/30 border-2 rounded-3xl transition-all duration-300 shadow-md relative overflow-hidden ${paymentMethod === 'upi' ? 'border-organic-500 shadow-organic-100 ring-4 ring-organic-50' : 'border-earthy-100 hover:border-organic-200'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${paymentMethod === 'upi' ? 'bg-organic-100 text-organic-600' : 'bg-earthy-50 text-earthy-400'}`}>
                                                                <Smartphone size={28} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-display font-bold text-earthy-900 text-sm md:text-lg leading-tight truncate">UPI Payment</p>
                                                                <p className="text-[10px] md:text-sm font-medium text-earthy-500 truncate">Google Pay, PhonePe, Paytm, etc.</p>
                                                            </div>
                                                        </div>
                                                        {paymentMethod === 'upi' && (
                                                            <div className="w-8 h-8 rounded-full bg-organic-500 text-white flex items-center justify-center shadow-lg">
                                                                <CheckCircle size={18} fill="currentColor" className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Expanded Content for UPI */}
                                                    <AnimatePresence>
                                                        {paymentMethod === 'upi' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-dashed border-earthy-200">
                                                                    <p className="text-xs md:text-sm font-semibold text-earthy-600 mb-3 md:mb-4 ml-1">Select your app to generate Payment QR</p>

                                                                    <div className="flex flex-wrap gap-2 md:gap-3 mb-2 p-1">
                                                                        {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                                                                            <button
                                                                                key={app}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleUpiAppSelect(app);
                                                                                }}
                                                                                className={`flex-1 min-w-[80px] md:min-w-[100px] flex items-center justify-center py-2 md:py-3 px-3 md:px-4 rounded-xl border-2 font-bold text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${selectedUpiApp === app ? 'border-organic-600 bg-organic-600 text-white shadow-lg shadow-organic-200 transform scale-105' : 'border-earthy-100 bg-white text-earthy-600 hover:border-organic-300 hover:bg-organic-50'}`}
                                                                            >
                                                                                {app}
                                                                            </button>
                                                                        ))}
                                                                    </div>

                                                                    <AnimatePresence mode="wait">
                                                                        {selectedUpiApp && (
                                                                            <motion.div
                                                                                key={selectedUpiApp} // Remounts to simulate generating new QR
                                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                                className="mt-4 md:mt-6 bg-white p-4 md:p-6 rounded-2xl border border-earthy-100 shadow-inner flex flex-col items-center relative overflow-hidden"
                                                                            >
                                                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-organic-400 via-yellow-400 to-organic-400 animate-pulse" />

                                                                                <p className="text-xs md:text-sm font-bold text-earthy-900 mb-3 md:mb-4 text-center">
                                                                                    Scan with <span className="text-organic-600">{selectedUpiApp}</span> to Pay <span className="text-base md:text-lg">₹{total}</span>
                                                                                </p>

                                                                                <div className="p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm border border-earthy-100 mb-3 md:mb-4 relative group">
                                                                                    <img
                                                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=shop@upi&pn=OrganicShop&am=${total}&tn=${selectedUpiApp}`}
                                                                                        alt="Payment QR Code"
                                                                                        className="w-32 h-32 md:w-44 md:h-44 object-contain rounded-lg md:rounded-xl mix-blend-multiply"
                                                                                    />
                                                                                    {/* Corner Accents */}
                                                                                    <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-organic-500 rounded-tl-lg" />
                                                                                    <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-organic-500 rounded-tr-lg" />
                                                                                    <div className="absolute bottom-2 left-2 w-3 h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-organic-500 rounded-bl-lg" />
                                                                                    <div className="absolute bottom-2 right-2 w-3 h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-organic-500 rounded-br-lg" />
                                                                                </div>

                                                                                {/* Timer */}
                                                                                <div className={`flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-mono font-bold px-3 py-1 md:px-4 md:py-2 rounded-full transition-colors ${timer < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-organic-50 text-organic-700'}`}>
                                                                                    <Clock size={12} className={timer < 60 ? 'text-red-500 md:w-[14px] md:h-[14px]' : 'text-organic-500 md:w-[14px] md:h-[14px]'} />
                                                                                    Expires in {formatTime(timer)}
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            {/* Option 3: COD (Disabled) */}
                                            <div className="relative group opacity-60 grayscale cursor-not-allowed">
                                                <div className="p-6 bg-earthy-50/50 border border-earthy-100 rounded-3xl flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-earthy-100 text-earthy-400 flex items-center justify-center">
                                                        <Truck size={28} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-0.5 md:mb-1">
                                                            <p className="font-display font-bold text-earthy-700 text-sm md:text-lg truncate">Cash on Delivery</p>
                                                            <div className="bg-earthy-200/50 p-1 md:p-1.5 rounded-lg text-earthy-500 shrink-0">
                                                                <div className="w-3 h-3 md:w-4 md:h-4"><ShieldCheck className="w-full h-full" /></div>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] md:text-sm font-medium text-earthy-400 truncate">Currently unavailable for your location</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={isSubmitting || (paymentMethod === 'upi' && !selectedUpiApp)}
                                                className={`w-full group relative overflow-hidden bg-gradient-to-r from-[#1A3019] to-[#254024] text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg tracking-wide shadow-[0_20px_40px_-15px_rgba(26,48,25,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(26,48,25,0.4)] transition-all duration-300 flex flex-col items-center justify-center gap-1 ${(isSubmitting || (paymentMethod === 'upi' && !selectedUpiApp)) ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                                            >
                                                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                                                    {isSubmitting ? 'PROCESSING...' : `PAY ₹${total}`}
                                                    {!isSubmitting && <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />}
                                                </div>
                                                {/* Shimmer Effect */}
                                                {!isSubmitting && (paymentMethod !== 'upi' || selectedUpiApp) && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />}
                                            </button>

                                            <div className="mt-3 md:mt-4 flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-semibold text-organic-700/70">
                                                <ShieldCheck size={12} className="md:w-[14px] md:h-[14px]" />
                                                Payments are secure and encrypted
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-[3rem] p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 ring-1 ring-earthy-100 sticky top-24 md:top-32 overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-organic-400 via-yellow-400 to-earthy-400" />

                            <h3 className="text-lg md:text-2xl font-display font-bold text-earthy-900 mb-4 md:mb-8 flex items-center justify-between">
                                Order Summary
                                <span className="text-xs md:text-sm font-sans font-medium text-earthy-500 bg-earthy-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full">{cart.length} items</span>
                            </h3>

                            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-2 md:gap-5 group">
                                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-earthy-50 overflow-hidden shrink-0 border border-earthy-100 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="font-bold text-earthy-900 line-clamp-1 text-xs md:text-lg leading-tight mb-0.5 md:mb-1">{item.name}</p>
                                            <p className="text-[10px] md:text-sm text-earthy-500 font-medium">Qty: <span className="text-earthy-900">{item.quantity}</span></p>
                                            <p className="text-xs md:text-base font-bold text-organic-700 mt-0.5 md:mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-3 md:pt-6 border-t border-earthy-200/60 space-y-1.5 md:space-y-3">
                                <div className="flex justify-between text-earthy-600 text-xs md:text-base">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-earthy-900">₹{total}</span>
                                </div>
                                <div className="flex justify-between text-earthy-600 text-xs md:text-base">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-[10px] md:text-sm">Free</span>
                                </div>
                                <div className="flex justify-between text-lg md:text-2xl font-display font-bold text-earthy-900 pt-2 md:pt-4 border-t border-dashed border-earthy-200 mt-2 md:mt-4">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
