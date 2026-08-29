import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User, ShieldCheck, Truck, Mail, Smartphone, Clock, ArrowRight, Plus, Home, Briefcase, Tag, Trash2 } from 'lucide-react';

const Checkout = () => {
    const { cart, createOrder, clearCart } = useShop();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        pincode: '',
        address: '',
        addressType: 'Home'
    });
    const [paymentMethod, setPaymentMethod] = useState('card');

    // UPI State
    const [selectedUpiApp, setSelectedUpiApp] = useState(null);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Fetch saved addresses from server / localStorage on load
    useEffect(() => {
        const loadAddresses = async () => {
            const token = localStorage.getItem('token');
            let addresses = [];

            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/addresses`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    addresses = res.data || [];
                } catch (err) {
                    console.warn('Could not fetch server addresses:', err);
                }
            }

            // Fallback to local storage if empty
            if (addresses.length === 0) {
                try {
                    const localSaved = localStorage.getItem('Purazya_saved_addresses');
                    if (localSaved) {
                        addresses = JSON.parse(localSaved);
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            setSavedAddresses(addresses);

            if (addresses.length > 0) {
                // Select default or first
                const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
                setSelectedAddressId(defaultAddr.id);
                setFormData({
                    firstName: defaultAddr.first_name || '',
                    lastName: defaultAddr.last_name || '',
                    email: defaultAddr.email || user?.email || '',
                    mobile: defaultAddr.phone || '',
                    pincode: defaultAddr.pincode || '',
                    address: defaultAddr.address_line || defaultAddr.address || '',
                    addressType: defaultAddr.address_type || 'Home'
                });
                setIsAddingNew(false);
            } else {
                // Pre-fill basic info from user profile
                if (user) {
                    const nameParts = (user.name || '').split(' ');
                    setFormData(prev => ({
                        ...prev,
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        email: user.email || '',
                        mobile: user.phone || ''
                    }));
                }
                setIsAddingNew(true);
            }
        };

        loadAddresses();
    }, [user]);

    // Handle Selecting a Saved Address
    const handleSelectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setFormData({
            firstName: addr.first_name || '',
            lastName: addr.last_name || '',
            email: addr.email || user?.email || '',
            mobile: addr.phone || '',
            pincode: addr.pincode || '',
            address: addr.address_line || addr.address || '',
            addressType: addr.address_type || 'Home'
        });
        setIsAddingNew(false);
    };

    // Save and proceed with new address
    const handleSaveAndProceed = async () => {
        if (!formData.firstName || !formData.mobile || !formData.pincode || !formData.address) {
            showToast('Please fill all required shipping fields.', 'error');
            return;
        }

        if (saveAddressForFuture) {
            const token = localStorage.getItem('token');
            const newAddrPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.mobile,
                pincode: formData.pincode,
                address: formData.address,
                addressType: formData.addressType,
                isDefault: savedAddresses.length === 0
            };

            let savedItem = {
                id: Date.now(),
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.mobile,
                pincode: formData.pincode,
                address_line: formData.address,
                address_type: formData.addressType,
                is_default: savedAddresses.length === 0
            };

            if (token) {
                try {
                    const res = await axios.post(`${API_URL}/addresses`, newAddrPayload, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.data) savedItem = res.data;
                } catch (err) {
                    console.warn('Could not save address to server:', err);
                }
            }

            const updatedList = [savedItem, ...savedAddresses];
            setSavedAddresses(updatedList);
            localStorage.setItem('Purazya_saved_addresses', JSON.stringify(updatedList));
            setSelectedAddressId(savedItem.id);
        }

        setStep(2);
    };

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
        setTimer(300);
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
                paymentMethod: paymentMethod,
                shippingDetails: formData
            };

            await createOrder(orderData);
            clearCart();
            showToast('Order placed successfully!');
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
                <p className="text-earthy-600 font-medium">Redirecting to cart...</p>
                {setTimeout(() => navigate('/cart'), 0)}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 px-3 sm:px-6 md:px-8 bg-[#F9F8F6] relative overflow-x-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[700px] h-[700px] bg-organic-200/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[600px] h-[600px] bg-yellow-200/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            <div className="max-w-[1180px] mx-auto relative z-10 w-full">
                {/* Back Link & Title */}
                <button
                    onClick={() => navigate('/cart')}
                    className="group inline-flex items-center gap-1.5 text-earthy-500 hover:text-earthy-900 font-bold mb-3 md:mb-5 transition-colors text-xs sm:text-sm"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Basket</span>
                </button>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-earthy-900 mb-6 md:mb-8 flex items-center gap-2">
                    <span>Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-organic-600 to-organic-400">Checkout</span></span>
                    <ShieldCheck className="text-organic-600 w-6 h-6 sm:w-8 sm:h-8" />
                </h1>

                <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start w-full min-w-0">
                    {/* Left Column: Form/Steps */}
                    <div className="lg:col-span-7 space-y-3.5 sm:space-y-6 w-full min-w-0">

                        {/* Step 1: Shipping Details */}
                        <div className={`bg-white rounded-2xl md:rounded-3xl p-3.5 sm:p-6 md:p-7 shadow-sm border transition-all duration-300 w-full min-w-0 ${step === 1 ? 'border-organic-500 ring-2 ring-organic-100 shadow-md' : 'border-earthy-100'}`}>
                            <div className="flex items-center justify-between mb-3.5 sm:mb-6">
                                <h2 className="text-sm sm:text-lg md:text-xl font-display font-bold text-earthy-900 flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${step === 1 ? 'bg-organic-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                        {step > 1 ? 'Step 1 ✓' : 'Step 1'}
                                    </span>
                                    <span>Delivery Address</span>
                                </h2>
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-xs font-bold text-organic-700 hover:text-organic-800 bg-organic-50 hover:bg-organic-100 px-2.5 py-1 rounded-lg transition-colors border border-organic-200"
                                    >
                                        Change Address
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4 w-full min-w-0"
                                    >
                                        {/* Saved Addresses List (Amazon / Flipkart Style) */}
                                        {savedAddresses.length > 0 && !isAddingNew && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold text-earthy-700 uppercase tracking-wider">
                                                        Select from Saved Addresses ({savedAddresses.length})
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingNew(true);
                                                            setFormData({
                                                                firstName: '',
                                                                lastName: '',
                                                                email: user?.email || '',
                                                                mobile: user?.phone || '',
                                                                pincode: '',
                                                                address: '',
                                                                addressType: 'Home'
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-organic-700 hover:text-organic-800 bg-organic-50 hover:bg-organic-100 px-2.5 py-1 rounded-lg transition-colors border border-organic-200"
                                                    >
                                                        <Plus size={14} />
                                                        <span>Add New Address</span>
                                                    </button>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {savedAddresses.map((addr) => {
                                                        const isSelected = selectedAddressId === addr.id;
                                                        return (
                                                            <div
                                                                key={addr.id}
                                                                onClick={() => handleSelectAddress(addr)}
                                                                className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                                        ? 'border-organic-600 bg-organic-50/30 ring-2 ring-organic-100 shadow-sm'
                                                                        : 'border-earthy-200 bg-white hover:border-earthy-300'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex items-start gap-2.5 min-w-0">
                                                                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-organic-600 bg-organic-600' : 'border-earthy-300 bg-white'
                                                                            }`}>
                                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                                <span className="font-bold text-earthy-900 text-xs sm:text-sm truncate">
                                                                                    {addr.first_name} {addr.last_name}
                                                                                </span>
                                                                                <span className="px-2 py-0.5 bg-earthy-100 text-earthy-700 rounded-md text-[10px] font-extrabold uppercase">
                                                                                    {addr.address_type || 'Home'}
                                                                                </span>
                                                                                {addr.is_default && (
                                                                                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                                                                                        DEFAULT
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-earthy-600 leading-relaxed break-words">
                                                                                {addr.address_line || addr.address}
                                                                            </p>
                                                                            <p className="text-xs text-earthy-500 mt-1 flex items-center gap-3">
                                                                                <span><strong>PIN:</strong> {addr.pincode}</span>
                                                                                <span><strong>Phone:</strong> {addr.phone}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="w-full mt-3 bg-earthy-900 hover:bg-earthy-800 text-white py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span>Deliver to this Address</span>
                                                    <ArrowRight size={15} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Address Input Form (When adding new or no saved addresses) */}
                                        {(isAddingNew || savedAddresses.length === 0) && (
                                            <div className="space-y-3 sm:space-y-4 w-full min-w-0">
                                                {savedAddresses.length > 0 && (
                                                    <div className="flex items-center justify-between pb-2 border-b border-earthy-100">
                                                        <p className="text-xs font-bold text-earthy-800">Add New Delivery Address</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAddingNew(false)}
                                                            className="text-xs font-bold text-earthy-500 hover:text-earthy-800 underline"
                                                        >
                                                            Cancel & Use Saved
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full min-w-0">
                                                    <div className="w-full min-w-0">
                                                        <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">First Name *</label>
                                                        <div className="relative w-full min-w-0">
                                                            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" />
                                                            <input
                                                                type="text"
                                                                required
                                                                value={formData.firstName}
                                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                                placeholder="First Name"
                                                                className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all placeholder:text-earthy-300 box-border"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full min-w-0">
                                                        <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">Last Name</label>
                                                        <div className="relative w-full min-w-0">
                                                            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" />
                                                            <input
                                                                type="text"
                                                                value={formData.lastName}
                                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                                placeholder="(Optional)"
                                                                className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all placeholder:text-earthy-300 box-border"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full min-w-0">
                                                    <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">Email Address</label>
                                                    <div className="relative w-full min-w-0">
                                                        <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="you@example.com"
                                                            className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all placeholder:text-earthy-300 box-border"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full min-w-0">
                                                    <div className="w-full min-w-0">
                                                        <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">Mobile Number *</label>
                                                        <div className="relative w-full min-w-0">
                                                            <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" />
                                                            <input
                                                                type="tel"
                                                                required
                                                                value={formData.mobile}
                                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                                placeholder="10-digit Mobile"
                                                                className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all placeholder:text-earthy-300 box-border"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full min-w-0">
                                                        <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">PIN Code *</label>
                                                        <div className="relative w-full min-w-0">
                                                            <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" />
                                                            <input
                                                                type="text"
                                                                required
                                                                value={formData.pincode}
                                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                                placeholder="6-digit PIN"
                                                                className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all placeholder:text-earthy-300 box-border"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full min-w-0">
                                                    <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1">Flat, House No., Building, Street *</label>
                                                    <div className="relative w-full min-w-0">
                                                        <MapPin size={14} className="absolute left-2.5 top-2.5 text-earthy-400" />
                                                        <textarea
                                                            rows="2"
                                                            required
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            placeholder="Door / Flat No., Street, Area, City"
                                                            className="w-full bg-earthy-50/50 rounded-xl pl-8 pr-2.5 py-2 border border-earthy-200 focus:outline-none focus:bg-white focus:border-organic-500 focus:ring-2 focus:ring-organic-100 text-xs sm:text-sm font-medium text-earthy-900 transition-all resize-none placeholder:text-earthy-300 box-border"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Address Type Selector */}
                                                <div>
                                                    <label className="block text-[10px] sm:text-xs font-bold text-earthy-600 uppercase tracking-wider mb-1.5">Address Type</label>
                                                    <div className="flex gap-2">
                                                        {['Home', 'Work', 'Other'].map(type => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, addressType: type })}
                                                                className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${formData.addressType === type
                                                                        ? 'border-organic-600 bg-organic-50 text-organic-800'
                                                                        : 'border-earthy-200 bg-white text-earthy-600 hover:bg-earthy-50'
                                                                    }`}
                                                            >
                                                                {type === 'Home' && <Home size={13} />}
                                                                {type === 'Work' && <Briefcase size={13} />}
                                                                {type === 'Other' && <Tag size={13} />}
                                                                <span>{type}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Save Address Checkbox */}
                                                <label className="flex items-center gap-2 cursor-pointer pt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={saveAddressForFuture}
                                                        onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                                                        className="rounded text-organic-600 focus:ring-organic-500 w-4 h-4"
                                                    />
                                                    <span className="text-xs font-medium text-earthy-700">Save this address for faster checkout in future</span>
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={handleSaveAndProceed}
                                                    className="w-full mt-2 bg-earthy-900 hover:bg-earthy-800 text-white py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span>Save & Continue to Payment</span>
                                                    <ArrowRight size={15} />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="bg-earthy-50/60 rounded-xl p-3 sm:p-4 border border-earthy-100 text-xs sm:text-sm space-y-1 w-full min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-earthy-900 flex items-center gap-1.5 truncate">
                                                <User size={14} className="text-organic-600 shrink-0" />
                                                {formData.firstName} {formData.lastName}
                                            </p>
                                            <span className="px-2 py-0.5 bg-earthy-200/80 text-earthy-800 rounded text-[10px] font-bold uppercase">
                                                {formData.addressType || 'Home'}
                                            </span>
                                        </div>
                                        <p className="text-earthy-600 truncate"><span className="font-medium text-earthy-400">Mobile:</span> {formData.mobile}</p>
                                        <p className="text-earthy-600 break-words"><span className="font-medium text-earthy-400">Address:</span> {formData.address}, PIN: {formData.pincode}</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className={`bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-7 shadow-sm border transition-all duration-300 ${step === 2 ? 'border-organic-500 ring-2 ring-organic-100 shadow-md' : 'border-earthy-100'}`}>
                            <h2 className="text-base sm:text-lg md:text-xl font-display font-bold text-earthy-900 mb-4 flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${step === 2 ? 'bg-organic-600 text-white' : 'bg-earthy-100 text-earthy-500'}`}>
                                    Step 2
                                </span>
                                <span>Payment Method</span>
                            </h2>

                            <AnimatePresence>
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        <p className="text-earthy-500 text-xs sm:text-sm font-medium">Select your preferred payment mode</p>

                                        {/* Option 1: Card */}
                                        <label className="block cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethod('card')}
                                                className="sr-only"
                                            />
                                            <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-organic-600 bg-organic-50/40 ring-2 ring-organic-100' : 'border-earthy-100 bg-white hover:border-earthy-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-organic-100 text-organic-700' : 'bg-earthy-100 text-earthy-500'}`}>
                                                            <CreditCard size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-earthy-900 text-xs sm:text-sm">Credit / Debit Card</p>
                                                            <p className="text-[10px] sm:text-xs text-earthy-400">Visa, Mastercard, RuPay & more</p>
                                                        </div>
                                                    </div>
                                                    {paymentMethod === 'card' && (
                                                        <div className="w-5 h-5 rounded-full bg-organic-600 text-white flex items-center justify-center">
                                                            <CheckCircle size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-1.5 pt-1 pl-12">
                                                    {['Visa', 'Mastercard', 'RuPay'].map(brand => (
                                                        <span key={brand} className="px-2 py-0.5 bg-white border border-earthy-200 rounded text-[10px] font-bold text-earthy-600">
                                                            {brand}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </label>

                                        {/* Option 2: UPI */}
                                        <div
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-organic-600 bg-organic-50/40 ring-2 ring-organic-100' : 'border-earthy-100 bg-white hover:border-earthy-200'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-organic-100 text-organic-700' : 'bg-earthy-100 text-earthy-500'}`}>
                                                        <Smartphone size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-earthy-900 text-xs sm:text-sm">UPI Payment</p>
                                                        <p className="text-[10px] sm:text-xs text-earthy-400">Google Pay, PhonePe, Paytm QR</p>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'upi' && (
                                                    <div className="w-5 h-5 rounded-full bg-organic-600 text-white flex items-center justify-center">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* UPI Expandable Apps */}
                                            {paymentMethod === 'upi' && (
                                                <div className="mt-3 pt-3 border-t border-earthy-200/60" onClick={(e) => e.stopPropagation()}>
                                                    <p className="text-xs font-bold text-earthy-700 mb-2">Select app to generate QR Code:</p>
                                                    <div className="flex gap-2">
                                                        {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                                                            <button
                                                                key={app}
                                                                type="button"
                                                                onClick={() => handleUpiAppSelect(app)}
                                                                className={`flex-1 py-1.5 px-2 rounded-lg border font-bold text-xs transition-all ${selectedUpiApp === app ? 'border-organic-600 bg-organic-600 text-white shadow-sm' : 'border-earthy-200 bg-white text-earthy-700 hover:bg-earthy-50'}`}
                                                            >
                                                                {app}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {selectedUpiApp && (
                                                        <div className="mt-3 bg-white p-3 sm:p-4 rounded-xl border border-earthy-200 flex flex-col items-center">
                                                            <p className="text-xs font-bold text-earthy-900 mb-2">
                                                                Scan with <span className="text-organic-600">{selectedUpiApp}</span> to Pay ₹{total}
                                                            </p>
                                                            <img
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=Purazya@upi&pn=Purazya&am=${total}&tn=${selectedUpiApp}`}
                                                                alt="UPI QR"
                                                                className="w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-lg border border-earthy-100 p-1"
                                                            />
                                                            <div className="mt-2 flex items-center gap-1 text-[11px] font-mono font-bold text-organic-700 bg-organic-50 px-2.5 py-1 rounded-full">
                                                                <Clock size={12} />
                                                                <span>Expires in {formatTime(timer)}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Option 3: COD (Disabled) */}
                                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-earthy-100 bg-earthy-50/50 opacity-60 flex items-center justify-between cursor-not-allowed">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-earthy-200 text-earthy-400 flex items-center justify-center">
                                                    <Truck size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-earthy-700 text-xs sm:text-sm">Cash on Delivery</p>
                                                    <p className="text-[10px] text-earthy-400">Currently unavailable</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-earthy-400 bg-earthy-200 px-2 py-0.5 rounded">Disabled</span>
                                        </div>

                                        {/* Pay Button */}
                                        <div className="pt-3">
                                            <button
                                                type="button"
                                                onClick={handlePlaceOrder}
                                                disabled={isSubmitting || (paymentMethod === 'upi' && !selectedUpiApp)}
                                                className={`w-full bg-organic-700 hover:bg-organic-800 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-organic-700/25 transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            >
                                                <span>{isSubmitting ? 'Processing Payment...' : `Pay ₹${total}`}</span>
                                                {!isSubmitting && <ArrowRight size={18} />}
                                            </button>

                                            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-earthy-400 text-[11px] font-medium">
                                                <ShieldCheck size={14} className="text-emerald-600" />
                                                <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 sticky top-24 md:top-32 w-full">
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-earthy-100 p-4 sm:p-6 md:p-7 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-organic-500 to-emerald-400" />

                            <h3 className="text-lg sm:text-xl font-display font-bold text-earthy-900 mb-4 pb-2 border-b border-earthy-100 flex items-center justify-between">
                                <span>Order Summary</span>
                                <span className="text-xs font-sans font-semibold text-organic-700 bg-organic-50 px-2.5 py-0.5 rounded-full border border-organic-100">
                                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </h3>

                            {/* Product List */}
                            <div className="space-y-3 mb-4 max-h-56 sm:max-h-64 overflow-y-auto no-scrollbar pr-1">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-earthy-50/50 border border-earthy-100/80">
                                        <img src={item.image} alt={item.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0 border border-earthy-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-earthy-900 text-xs sm:text-sm truncate">{item.name}</p>
                                            <p className="text-[11px] text-earthy-400">Qty: <span className="font-bold text-earthy-700">{item.quantity}</span></p>
                                        </div>
                                        <span className="font-bold text-organic-700 text-xs sm:text-sm shrink-0">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 pt-2 border-t border-earthy-100 text-xs sm:text-sm">
                                <div className="flex justify-between text-earthy-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-earthy-900">₹{total}</span>
                                </div>
                                <div className="flex justify-between text-earthy-600 font-medium">
                                    <span>Delivery Charge</span>
                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">FREE</span>
                                </div>
                                <div className="flex justify-between text-base sm:text-lg font-display font-bold text-earthy-900 pt-3 border-t border-dashed border-earthy-200">
                                    <span>Total Payable</span>
                                    <span className="text-organic-800">₹{total}</span>
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
