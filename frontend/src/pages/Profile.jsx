import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, Leaf, Award, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Mock user data
    const [userData, setUserData] = useState({
        name: user?.name || 'Abinandhan',
        email: user?.email || 'abi@example.com',
        phone: user?.phone || '+91 98765 43210',
        address: '123, Green Earth Avenue, Coimbatore, TN - 641001',
        bio: 'Passionate about organic living and healthy eating. 🌱',
        avatar: user?.profile_picture || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&q=80'
    });

    // Add import statement at top if not present: import axios from 'axios';

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', user.id || 1); // Ideally get ID from context/token

        try {
            // Optimistic update
            const objectUrl = URL.createObjectURL(file);
            setUserData(prev => ({ ...prev, avatar: objectUrl }));

            const response = await axios.post('http://localhost:5001/api/auth/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.avatarUrl) {
                setUserData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
                // Persist to global auth state and local storage
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

    const handleSave = () => {
        setIsEditing(false);
        showToast('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-8 lg:px-12 bg-[#FAF9F6] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-organic-200/30 to-earthy-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-yellow-100/40 to-organic-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[95%] mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-10 gap-2 md:gap-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-1.5 md:gap-2 text-earthy-500 hover:text-organic-700 font-bold transition-colors group text-sm md:text-base">
                        <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full shadow-sm border border-earthy-100">
                        <span className="flex h-2.5 w-2.5 md:h-3 md:w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                        </span>
                        <span className="text-[10px] md:text-sm font-bold text-earthy-600">Active Member</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Card (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden text-center sticky top-32 h-full flex flex-col justify-between group/card">
                            {/* Decorative header */}
                            <div className="absolute top-0 left-0 right-0 h-28 md:h-40 bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c164196e?w=800&q=80')] bg-cover bg-center overflow-hidden">
                                <div className="absolute inset-0 bg-[#1A2E16]/60 backdrop-blur-sm" />
                                {/* Floating Particles */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-4 left-4 text-white/20"
                                >
                                    <Leaf size={24} />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-4 right-8 text-white/10"
                                >
                                    <Leaf size={32} />
                                </motion.div>
                            </div>

                            <div className="relative pt-10 md:pt-16 mb-4 md:mb-6">
                                <div className="w-28 h-28 md:w-40 md:h-40 mx-auto relative group">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-organic-400 to-organic-600 blur-md"
                                    />
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                                    />
                                    <label className="absolute bottom-2 right-2 z-20 cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="bg-white text-earthy-900 p-2 md:p-2.5 rounded-full shadow-lg hover:bg-organic-50 hover:text-organic-600 transition-colors"
                                        >
                                            <Camera size={16} className="md:w-[18px] md:h-[18px]" />
                                        </motion.div>
                                    </label>
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-display font-bold text-earthy-900 mb-1 relative z-10">{userData.name}</h2>
                            <p className="text-earthy-500 text-sm md:text-base font-medium mb-6 md:mb-8 flex items-center justify-center gap-2 relative z-10">
                                <Leaf size={16} className="text-organic-500 animate-bounce-slow" />
                                {userData.bio}
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                                    className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm"
                                >
                                    <Package size={20} className="md:w-6 md:h-6 text-organic-600 mb-2 mx-auto" />
                                    <span className="block text-xl md:text-2xl font-black text-earthy-900">12</span>
                                    <span className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wide">Orders</span>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 shadow-sm"
                                >
                                    <Award size={20} className="md:w-6 md:h-6 text-amber-600 mb-2 mx-auto" />
                                    <span className="block text-xl md:text-2xl font-black text-earthy-900">150</span>
                                    <span className="text-[10px] md:text-xs font-bold text-earthy-500 uppercase tracking-wide">Points</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Card (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        {/* ... same card ... */}
                        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-12 shadow-xl border border-earthy-100 h-full">
                            {/* ... kept header ... */}
                            {/* ... rest of the card ... */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-10 gap-4">
                                <div>
                                    <h3 className="text-base md:text-2xl font-bold text-earthy-900 flex flex-wrap items-center gap-2 md:gap-3">
                                        Profile Settings
                                        {!isEditing && <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-500 text-[9px] md:text-xs rounded-full font-bold uppercase tracking-wider">Read Only</span>}
                                    </h3>
                                    <p className="text-[10px] md:text-base text-earthy-500 mt-1">Manage your personal information and preferences.</p>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`w-full md:w-auto px-4 md:px-8 py-2.5 md:py-3 rounded-2xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isEditing
                                        ? 'bg-[#1A2E16] text-white hover:bg-[#2F4F2C] shadow-organic-200'
                                        : 'bg-white text-earthy-900 border border-earthy-200 hover:border-organic-300 hover:text-organic-700'
                                        }`}
                                >
                                    {isEditing ? <><Save size={16} className="md:w-[18px] md:h-[18px]" /> Save Changes</> : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="space-y-3 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
                                    <div className="group">
                                        <label className="text-[9px] md:text-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                                        <div className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                            <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <User size={16} className="md:w-5 md:h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={userData.name}
                                                disabled={!isEditing}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                className="bg-transparent w-full outline-none text-[11px] md:text-lg font-bold text-earthy-800 placeholder-earthy-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] md:text-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                                        <div className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                            <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Mail size={16} className="md:w-5 md:h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                value={userData.email}
                                                disabled={!isEditing}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                className="bg-transparent w-full outline-none text-[11px] md:text-lg font-bold text-earthy-800 placeholder-earthy-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[9px] md:text-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                                    <div className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                        <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-colors ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Phone size={16} className="md:w-5 md:h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={userData.phone}
                                            disabled={!isEditing}
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                            className="bg-transparent w-full outline-none text-[11px] md:text-lg font-bold text-earthy-800 placeholder-earthy-300"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[9px] md:text-xs font-bold text-earthy-400 uppercase tracking-widest ml-1 mb-1 block">Shipping Address</label>
                                    <div className={`flex items-start gap-2 md:gap-4 p-2.5 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${isEditing ? 'bg-white border-organic-200 ring-4 ring-organic-50' : 'bg-[#FAFAFA] border-transparent'}`}>
                                        <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-colors mt-0.5 md:mt-1 ${isEditing ? 'bg-organic-50 text-organic-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <MapPin size={16} className="md:w-5 md:h-5" />
                                        </div>
                                        <textarea
                                            value={userData.address}
                                            disabled={!isEditing}
                                            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                            className="bg-transparent w-full outline-none text-[11px] md:text-lg font-medium text-earthy-800 placeholder-earthy-300 min-h-[60px] md:min-h-[100px] resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
