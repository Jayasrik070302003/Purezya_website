import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config/api';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, Leaf, Award, Package, Star, Plus, Home, Briefcase, Tag, Trash2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        pincode: '',
        address: '',
        addressType: 'Home'
    });

    const [userData, setUserData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        bio: '',
        avatar: user?.profile_picture || ''
    });

    // Synchronize userData when auth user loads/updates
    useEffect(() => {
        if (user) {
            setUserData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.profile_picture || prev.avatar
            }));
        }
    }, [user]);

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/addresses`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setSavedAddresses(res.data || []);
                } catch (err) {
                    console.warn('Failed to fetch addresses:', err);
                }
            }
        };
        fetchAddresses();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', user?.id || 1);

        try {
            const objectUrl = URL.createObjectURL(file);
            setUserData(prev => ({ ...prev, avatar: objectUrl }));

            const response = await axios.post(`${API_URL}/auth/upload-avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.avatarUrl) {
                setUserData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
                if (updateUser) {
                    updateUser({ profile_picture: response.data.avatarUrl });
                }
                showToast('Profile picture updated!');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            showToast('Failed to upload image', 'error');
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/auth/profile`, {
                name: userData.name,
                phone: userData.phone
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data?.user && updateUser) {
                updateUser(res.data.user);
            }
            setIsEditing(false);
            showToast('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            showToast('Failed to update profile', 'error');
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!newAddress.firstName || !newAddress.phone || !newAddress.pincode || !newAddress.address) {
            showToast('Please fill all required address fields', 'error');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(`${API_URL}/addresses`, {
                ...newAddress,
                email: user?.email || '',
                isDefault: savedAddresses.length === 0
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSavedAddresses([res.data, ...savedAddresses]);
            setIsAddingAddress(false);
            setNewAddress({
                firstName: '',
                lastName: '',
                phone: '',
                pincode: '',
                address: '',
                addressType: 'Home'
            });
            showToast('Address saved successfully!');
        } catch (err) {
            console.error(err);
            showToast('Failed to save address', 'error');
        }
    };

    const handleDeleteAddress = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/addresses/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSavedAddresses(savedAddresses.filter(a => a.id !== id));
            showToast('Address deleted');
        } catch (err) {
            console.error(err);
            showToast('Failed to delete address', 'error');
        }
    };

    const handleSetDefaultAddress = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/addresses/${id}/default`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSavedAddresses(savedAddresses.map(a => ({
                ...a,
                is_default: a.id === id
            })));
            showToast('Default address updated');
        } catch (err) {
            console.error(err);
            showToast('Failed to update default address', 'error');
        }
    };

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-organic-200/30 to-earthy-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-yellow-100/40 to-organic-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[95%] mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-fluid-xl gap-fluid-sm">
                    <Link to="/dashboard" className="inline-flex items-center gap-fluid-xs text-earthy-500 hover:text-organic-700 font-bold transition-colors group text-fluid-base">
                        <ArrowLeft className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)] group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-fluid-2xl p-fluid-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden text-center sticky top-32 h-full flex flex-col justify-between group/card">
                            <div className="absolute top-0 left-0 right-0 h-[clamp(7rem,15vw,10rem)] bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c164196e?w=800&q=80')] bg-cover bg-center overflow-hidden">
                                <div className="absolute inset-0 bg-[#1A2E16]/60 backdrop-blur-sm" />
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-4 left-4 text-white/20"
                                >
                                    <Leaf size={24} />
                                </motion.div>
                            </div>

                            <div className="relative z-10 pt-[clamp(3.5rem,7vw,5rem)] mb-fluid-lg">
                                <div className="relative inline-block group">
                                    <div className="w-[clamp(6rem,12vw,8rem)] h-[clamp(6rem,12vw,8rem)] rounded-full border-4 border-white shadow-2xl overflow-hidden mx-auto bg-earthy-100 flex items-center justify-center">
                                        {userData.avatar ? (
                                            <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-1/2 h-1/2 text-earthy-400" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-[clamp(0.375rem,1vw,0.5rem)] bg-organic-600 hover:bg-organic-700 text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95">
                                        <Camera className="w-[clamp(0.875rem,1.2vw,1rem)] h-[clamp(0.875rem,1.2vw,1rem)]" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <h2 className="text-fluid-2xl font-bold text-earthy-900 mt-fluid-sm tracking-tight">{userData.name || 'Purazya Customer'}</h2>
                                <p className="text-fluid-sm text-organic-700 font-semibold">{userData.email || 'customer@Purazya.com'}</p>
                            </div>

                            <div className="border-t border-earthy-100/80 pt-fluid-md flex justify-around">
                                <div className="text-center">
                                    <span className="block text-fluid-lg font-bold text-earthy-900">{savedAddresses.length}</span>
                                    <span className="text-[11px] text-earthy-400 uppercase tracking-wider font-semibold">Addresses</span>
                                </div>
                                <div className="h-8 w-px bg-earthy-100 my-auto"></div>
                                <div className="text-center">
                                    <span className="block text-fluid-lg font-bold text-organic-600">100%</span>
                                    <span className="text-[11px] text-earthy-400 uppercase tracking-wider font-semibold">Organic</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-fluid-2xl p-fluid-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-fluid-xl gap-fluid-sm">
                                <div>
                                    <h3 className="text-fluid-2xl font-bold text-earthy-900 flex flex-wrap items-center gap-fluid-xs">
                                        Profile Settings
                                        {!isEditing && <span className="px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-gray-100 text-gray-500 text-fluid-xs rounded-full font-bold uppercase tracking-wider">Read Only</span>}
                                    </h3>
                                    <p className="text-fluid-sm text-earthy-500 mt-fluid-xs">Manage your personal information and preferences.</p>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`w-full md:w-auto min-h-[42px] px-[clamp(1rem,3vw,2rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] rounded-fluid-xl text-fluid-sm font-bold flex items-center justify-center gap-fluid-xs transition-all shadow-lg active:scale-95 ${isEditing
                                        ? 'bg-[#1A2E16] text-white hover:bg-[#2F4F2C] shadow-organic-200'
                                        : 'bg-white text-earthy-900 border border-earthy-200 hover:border-organic-300 hover:text-organic-700'
                                        }`}
                                >
                                    {isEditing ? <><Save className="w-[clamp(1rem,1.5vw,1.125rem)] h-[clamp(1rem,1.5vw,1.125rem)]" /> Save Changes</> : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="space-y-fluid-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-md">
                                    <div className="group">
                                        <label className="text-fluid-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                                        <div className={`flex items-center gap-fluid-sm p-[clamp(0.5rem,2vw,1.25rem)] rounded-fluid-xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                            <div className={`p-[clamp(0.375rem,1vw,0.5rem)] rounded-fluid-lg transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <User className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)]" />
                                            </div>
                                            <input
                                                type="text"
                                                value={userData.name}
                                                disabled={!isEditing}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                className="bg-transparent w-full outline-none text-fluid-base font-bold text-earthy-800 placeholder-earthy-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-fluid-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                                        <div className={`flex items-center gap-fluid-sm p-[clamp(0.5rem,2vw,1.25rem)] rounded-fluid-xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                            <div className={`p-[clamp(0.375rem,1vw,0.5rem)] rounded-fluid-lg transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Mail className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)]" />
                                            </div>
                                            <input
                                                type="email"
                                                value={userData.email}
                                                disabled={!isEditing}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                className="bg-transparent w-full outline-none text-fluid-base font-bold text-earthy-800 placeholder-earthy-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="text-fluid-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                                    <div className={`flex items-center gap-fluid-sm p-[clamp(0.5rem,2vw,1.25rem)] rounded-fluid-xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                        <div className={`p-[clamp(0.375rem,1vw,0.5rem)] rounded-fluid-lg transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Phone className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)]" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={userData.phone}
                                            disabled={!isEditing}
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                            className="bg-transparent w-full outline-none text-fluid-base font-bold text-earthy-800 placeholder-earthy-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-fluid-2xl p-fluid-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-earthy-900 flex items-center gap-2">
                                        <MapPin className="text-organic-600 w-5 h-5" />
                                        Saved Delivery Addresses ({savedAddresses.length})
                                    </h3>
                                    <p className="text-xs text-earthy-500 mt-0.5">Manage multiple delivery locations for 1-click checkout.</p>
                                </div>
                                {!isAddingAddress && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingAddress(true)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-earthy-900 hover:bg-organic-600 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                                    >
                                        <Plus size={14} />
                                        <span>Add Address</span>
                                    </button>
                                )}
                            </div>

                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mb-6 p-4 rounded-2xl bg-earthy-50/70 border border-earthy-200 space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-earthy-200">
                                        <p className="text-xs font-bold text-earthy-900">Add New Address</p>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="text-xs font-bold text-earthy-500 hover:text-earthy-800 underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={newAddress.firstName}
                                                onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                                className="w-full bg-white rounded-xl px-3 py-2 border border-earthy-200 text-xs text-earthy-900 outline-none focus:border-organic-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={newAddress.lastName}
                                                onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                                className="w-full bg-white rounded-xl px-3 py-2 border border-earthy-200 text-xs text-earthy-900 outline-none focus:border-organic-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                className="w-full bg-white rounded-xl px-3 py-2 border border-earthy-200 text-xs text-earthy-900 outline-none focus:border-organic-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">PIN Code *</label>
                                            <input
                                                type="text"
                                                required
                                                value={newAddress.pincode}
                                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                className="w-full bg-white rounded-xl px-3 py-2 border border-earthy-200 text-xs text-earthy-900 outline-none focus:border-organic-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">Flat, House No., Street, Area *</label>
                                        <textarea
                                            rows="2"
                                            required
                                            value={newAddress.address}
                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                            className="w-full bg-white rounded-xl px-3 py-2 border border-earthy-200 text-xs text-earthy-900 outline-none focus:border-organic-500 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-earthy-600 uppercase mb-1">Address Type</label>
                                        <div className="flex gap-2">
                                            {['Home', 'Work', 'Other'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewAddress({ ...newAddress, addressType: type })}
                                                    className={`py-1 px-3 rounded-lg border text-xs font-bold transition-all ${newAddress.addressType === type
                                                            ? 'border-organic-600 bg-organic-50 text-organic-800'
                                                            : 'border-earthy-200 bg-white text-earthy-600'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-organic-600 hover:bg-organic-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                    >
                                        Save Address
                                    </button>
                                </form>
                            )}

                            <div className="space-y-3">
                                {savedAddresses.length === 0 ? (
                                    <div className="text-center py-6 text-earthy-400 text-xs">
                                        No saved addresses yet. Click "+ Add Address" or save one during checkout.
                                    </div>
                                ) : (
                                    savedAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className="p-3.5 sm:p-4 rounded-xl border border-earthy-200 bg-white hover:border-earthy-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
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

                                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                {!addr.is_default && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetDefaultAddress(addr.id)}
                                                        className="text-xs font-bold text-earthy-600 hover:text-organic-700 border border-earthy-200 hover:border-organic-300 px-2.5 py-1 rounded-lg transition-colors bg-earthy-50/50"
                                                    >
                                                        Set as Default
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="p-1.5 text-earthy-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Delete address"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
