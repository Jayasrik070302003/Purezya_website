import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Package, LayoutDashboard, Search, TrendingUp, DollarSign, ShoppingBag, Leaf, User, X, Check, Edit2, ClipboardList, ChevronRight, Trash2, LogOut, AlertCircle, Printer, Phone, Mail, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminDashboard = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Category Management State (Product Groups)
    const [categories, setCategories] = useState([
        { id: 1, name: 'Malt Beverages', status: 'Active', stock: 'High', count: 12 },
        { id: 2, name: 'Organic Atta', status: 'Active', stock: 'High', count: 8 },
        { id: 3, name: 'Snacks & Sweets', status: 'Active', stock: 'High', count: 15 },
        { id: 4, name: 'Noodles & Pasta', status: 'Active', stock: 'Medium', count: 6 },
        { id: 5, name: 'Wellness Products', status: 'Active', stock: 'Low', count: 4 },
    ]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', stock: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [timeRange, setTimeRange] = useState('Last 6 Months');

    // Product Editing State
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [editProductForm, setEditProductForm] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image_url: ''
    });

    const handleProductEditClick = (product) => {
        setProductToEdit(product);
        setEditProductForm({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            image_url: product.image_url || ''
        });
        setIsEditProductModalOpen(true);
    };

    const handleEditProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/products/${productToEdit.id}`, editProductForm, {
                headers: { 'x-auth-token': token }
            });

            // Update local state
            setProducts(prev => prev.map(p => p.id === productToEdit.id ? { ...p, ...editProductForm } : p));

            setIsEditProductModalOpen(false);
            setProductToEdit(null);
            setNotification({ type: 'success', message: 'Product updated successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            setNotification({ type: 'error', message: 'Failed to update product.' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditForm({ name: category.name, stock: category.stock });
    };

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSaveEdit = () => {
        if (!editingCategory) return;
        setCategories(prev => prev.map(c =>
            c.id === editingCategory.id ? { ...c, name: editForm.name, stock: editForm.stock } : c
        ));
        setEditingCategory(null);
        setNotification({ type: 'success', message: 'Category updated successfully!' });
        setTimeout(() => setNotification(null), 3000);
    };

    // ... (rest of logic)

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Malt Beverages',
        price: '',
        stock: '',
        description: '',
        image_url: ''
    });

    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setNotification({ type: 'error', message: 'Authentication token missing. Please login again.' });
                return;
            }

            await axios.post('http://localhost:5001/api/products', newProduct, {
                headers: { 'x-auth-token': token }
            });

            setIsAddModalOpen(false);
            setNewProduct({ name: '', category: 'Malt Beverages', price: '', stock: '', description: '', image_url: '' });

            // Show Premium Success Notification
            setNotification({ type: 'success', message: 'Product successfully added to inventory!' });
            setTimeout(() => setNotification(null), 3000);

            const productsRes = await axios.get('http://localhost:5001/api/products');
            setProducts(productsRes.data);

        } catch (error) {
            console.error('Error adding product:', error);
            setNotification({ type: 'error', message: 'Failed to add product. Please try again.' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/products/${productToDelete.id}`, {
                headers: { 'x-auth-token': token }
            });

            // Update local state
            setProducts(products.filter(p => p.id !== productToDelete.id));

            // Show success notification
            setNotification({ type: 'success', message: 'Product successfully deleted.' });
            setTimeout(() => setNotification(null), 3000);

            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            setNotification({ type: 'error', message: 'Failed to delete product.' });
            setTimeout(() => setNotification(null), 3000);
            setIsDeleteModalOpen(false); // Close modal even on error or keep open? Better close to avoid stuck state.
        }
    };

    useEffect(() => {
        if (!authLoading) {
            // Check for admin role
            if (!user || user.role !== 'admin') {
                navigate('/dashboard');
                return;
            }

            const fetchData = async () => {
                try {
                    const [statsRes, usersRes, ordersRes, productsRes] = await Promise.all([
                        axios.get('http://localhost:5001/api/admin/stats'),
                        axios.get('http://localhost:5001/api/admin/users'),
                        axios.get('http://localhost:5001/api/admin/orders'),
                        axios.get('http://localhost:5001/api/products')
                    ]);
                    setStats(statsRes.data);
                    setUsers(usersRes.data);
                    setOrders(ordersRes.data);
                    setProducts(productsRes.data);
                } catch (error) {
                    console.error("Error fetching admin data", error);
                } finally {
                    setDataLoading(false);
                }
            };
            fetchData();
        }
    }, [user, authLoading, navigate]);

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-earthy-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-600"></div>
        </div>
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleExportOrders = () => {
        // defined CSV headers
        const headers = ["Order ID", "Customer Name", "Email", "Status", "Amount", "Date"];
        const rows = orders.map(order => [
            order.id,
            order.user_name || 'Guest',
            order.user_email,
            order.status,
            order.total_amount,
            new Date(order.created_at).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setNotification({ type: 'success', message: 'Orders exported successfully!' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFilterOrders = () => {
        setNotification({ type: 'success', message: 'Filter feature coming soon!' });
        setTimeout(() => setNotification(null), 3000);
    };

    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const handleOrderView = async (orderId) => {
        try {
            // Find basic info immediately for quick response
            const basicOrder = orders.find(o => o.id === orderId);
            setSelectedOrderDetails({ ...basicOrder, isLoading: true });
            setIsOrderDetailsModalOpen(true);

            // Fetch full details
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/admin/orders/${orderId}`, {
                headers: { 'x-auth-token': token }
            });

            setSelectedOrderDetails(res.data);
        } catch (err) {
            console.error("Error fetching order details", err);
            setNotification({ type: 'error', message: 'Failed to load full order details' });
        }
    };

    const handlePrintInvoice = () => {
        if (!selectedOrderDetails) return;

        const printWindow = window.open('', '_blank');
        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${selectedOrderDetails.id}</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #2d3748; }
                    .invoice-title { font-size: 32px; font-weight: bold; color: #2d3748; text-align: right; }
                    .invoice-details { text-align: right; color: #718096; margin-top: 5px; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-size: 14px; text-transform: uppercase; font-weight: bold; color: #718096; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                    .info-group p { margin: 5px 0; }
                    .info-label { font-weight: bold; color: #4a5568; }
                    table { w-full; border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th { text-align: left; padding: 15px 0; border-bottom: 2px solid #eee; color: #4a5568; }
                    td { padding: 15px 0; border-bottom: 1px solid #eee; }
                    .text-right { text-align: right; }
                    .total-section { margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px; display: flex; justify-content: flex-end; }
                    .total-row { display: flex; justify-content: space-between; width: 300px; margin-bottom: 10px; }
                    .total-final { font-size: 20px; font-weight: bold; color: #2d3748; }
                    .footer { margin-top: 60px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">Purezya Life</div>
                        <div style="margin-top: 10px; color: #718096;">Admin Dashboard</div>
                    </div>
                    <div>
                        <div class="invoice-title">INVOICE</div>
                        <div class="invoice-details">Order #${selectedOrderDetails.id}</div>
                        <div class="invoice-details">Date: ${new Date(selectedOrderDetails.created_at).toLocaleDateString()}</div>
                    </div>
                </div>

                <div class="grid">
                    <div class="section">
                        <div class="section-title">Bill To</div>
                        <div class="info-group">
                            <p class="info-label">${selectedOrderDetails.user_name || 'Guest'}</p>
                            <p>${selectedOrderDetails.user_email}</p>
                            <p>${selectedOrderDetails.phone || ''}</p>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-title">Ship To</div>
                         <div class="info-group">
                            <p>${selectedOrderDetails.shipping_address || 'No shipping address provided'}</p>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Order Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="text-right">Unit Price</th>
                                <th class="text-right">Qty</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedOrderDetails.items ? selectedOrderDetails.items.map(item => `
                                <tr>
                                    <td>
                                        <div style="font-weight: bold;">${item.product_name}</div>
                                        <div style="font-size: 12px; color: #718096;">ID: ${item.product_id || 'N/A'}</div>
                                    </td>
                                    <td class="text-right">₹${parseFloat(item.price).toFixed(2)}</td>
                                    <td class="text-right">${item.quantity}</td>
                                    <td class="text-right">₹${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('') : ''}
                        </tbody>
                    </table>
                </div>

                <div class="total-section">
                    <div>
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>₹${parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                        </div>
                         <div class="total-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div class="total-row total-final">
                            <span>Total:</span>
                            <span>₹${parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>If you have any questions about this invoice, please contact support.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${activeTab === id
                ? 'bg-organic-600 text-white shadow-lg shadow-organic-600/30'
                : 'text-earthy-600 hover:bg-earthy-100'
                }`}
        >
            <Icon size={18} className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="font-medium">{label}</span>
            {activeTab === id && (
                <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
            )}
        </button>
    );

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden p-5 rounded-2xl bg-white border border-earthy-100 shadow-lg hover:shadow-xl transition-all"
        >
            {/* Decorative Background Blob */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ${color.split(' ')[1]}`} /> {/* Assumes bg-color is 2nd class */}

            <div className="relative z-10 flex justify-between items-start mb-3">
                <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} strokeWidth={2} />
                </div>
                {/* Optional: Add a small action button or indicator here if needed */}
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold text-earthy-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-earthy-500 font-medium text-xs border-l-2 border-earthy-200 pl-3 uppercase tracking-wider">{title}</p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                <TrendingUp size={14} />
                <span>+12% vs last month</span>
            </div>
        </motion.div>
    );



    return (
        <div className="min-h-screen bg-earthy-50 font-sans flex relative">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-earthy-100 h-screen fixed left-0 top-0 z-50 p-6 hidden lg:flex flex-col">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-organic-600 rounded-lg flex items-center justify-center">
                        <Leaf className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-display font-bold text-earthy-900 tracking-tight">Purezya<span className="text-organic-600">Admin</span></span>
                </div>

                <div className="space-y-2 flex-1">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="orders" icon={ClipboardList} label="Orders" />
                    <SidebarItem id="users" icon={Users} label="Users" />
                    <SidebarItem id="products" icon={Package} label="Products" />
                </div>

                <div className="mt-auto border-t border-earthy-100 pt-6">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-earthy-100 flex items-center justify-center text-earthy-600 font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-earthy-900 truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-earthy-500 truncate">{user?.email || 'admin@purezya.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group font-medium"
                    >
                        <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                            <LogOut size={18} />
                        </div>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto relative">
                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -50, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: -50, x: '-50%' }}
                                className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 min-w-[320px] justify-center
                                    ${notification.type === 'success'
                                        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                                        : 'bg-red-50/90 border-red-200 text-red-800'
                                    }`}
                            >
                                <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                    {notification.type === 'success' ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-500" />}
                                </div>
                                <span className="font-bold text-sm">{notification.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-display font-bold text-earthy-900">
                                {activeTab === 'dashboard' && 'Overview'}
                                {activeTab === 'orders' && 'Order Management'}
                                {activeTab === 'users' && 'User Management'}
                                {activeTab === 'products' && 'Product Catalog'}
                            </h1>
                            <p className="text-earthy-500 mt-1">Welcome back, Master Admin</p>
                        </div>
                        {activeTab === 'users' && (
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earthy-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-earthy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-organic-500/50 w-full md:w-64 transition-all"
                                />
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-organic-600 hover:bg-organic-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-organic-600/30 flex items-center gap-2 transition-all"
                            >
                                <Package size={18} /> Add New Item
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {dataLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center h-64"
                            >
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-600"></div>
                            </motion.div>
                        ) : activeTab === 'dashboard' ? (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid gap-8"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-600 bg-blue-100" delay={0.1} />
                                    <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="text-purple-600 bg-purple-100" delay={0.2} />
                                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={DollarSign} color="text-emerald-600 bg-emerald-100" delay={0.3} />
                                    <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="text-orange-600 bg-orange-100" delay={0.4} />
                                </div>

                                {/* Analytics & Insights Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Monthly Sales Analytics */}
                                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-earthy-100 shadow-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50" />

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-earthy-900 font-display flex items-center gap-3">
                                                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                                                    Revenue Analytics
                                                </h2>
                                                <div className="flex items-end gap-2 mt-2 ml-4.5">
                                                    <span className="text-2xl font-bold text-earthy-900 font-display">₹12,450</span>
                                                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-1">+12.5%</span>
                                                </div>
                                            </div>
                                            <FormControl size="small">
                                                <Select
                                                    value={timeRange}
                                                    onChange={(e) => setTimeRange(e.target.value)}
                                                    variant="outlined"
                                                    sx={{
                                                        minWidth: 160,
                                                        borderRadius: '0.75rem',
                                                        backgroundColor: '#f9fafb', // earthy-50
                                                        color: '#4b5563', // earthy-600
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem',
                                                        border: '1px solid #e5e7eb', // earthy-200
                                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                        '&:hover': { backgroundColor: '#f3f4f6' },
                                                        '&.Mui-focused': {
                                                            backgroundColor: '#ffffff',
                                                            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)', // emerald ring
                                                        },
                                                        '& .MuiSelect-icon': { color: '#4b5563' }
                                                    }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                borderRadius: '1rem',
                                                                marginTop: '0.5rem',
                                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                                                '& .MuiMenuItem-root': {
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    color: '#4b5563',
                                                                    padding: '0.6rem 1rem',
                                                                    '&:hover': { backgroundColor: '#ecfccb', color: '#365314' }, // organic hover
                                                                    '&.Mui-selected': { backgroundColor: '#dcfce7', color: '#166534' }, // emerald selected
                                                                    '&.Mui-selected:hover': { backgroundColor: '#dcfce7' }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                                                    <MenuItem value="Last Year">Last Year</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                        {/* Chart Container */}
                                        <div className="relative h-64 w-full">
                                            {/* Grid Lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-full h-px bg-earthy-50 border-t border-dashed border-earthy-100"></div>
                                                ))}
                                            </div>

                                            {/* Bars */}
                                            <div className="absolute inset-0 flex items-end justify-between gap-4 px-2 pt-4">
                                                {[
                                                    { label: 'Aug', value: 45, height: '45%' },
                                                    { label: 'Sep', value: 55, height: '55%' },
                                                    { label: 'Oct', value: 40, height: '40%' },
                                                    { label: 'Nov', value: 75, height: '75%' },
                                                    { label: 'Dec', value: 38, height: '38%' },
                                                    { label: 'Jan', value: 85, height: '85%' },
                                                ].map((bar, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-3 w-full h-full justify-end group/bar cursor-pointer">
                                                        {/* Bar Fill */}
                                                        <div className="w-full max-w-[60px] relative h-full flex items-end">
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: bar.height }}
                                                                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                                                                className={`w-full rounded-t-xl relative transition-all duration-300
                                                                     ${idx === 5
                                                                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/30'
                                                                        : 'bg-gradient-to-t from-earthy-100 to-earthy-200 group-hover/bar:from-emerald-400 group-hover/bar:to-emerald-300'
                                                                    }`}
                                                            >
                                                                {/* Tooltip */}
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-earthy-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-200 whitespace-nowrap z-20 shadow-xl scale-90 group-hover/bar:scale-100 pointer-events-none">
                                                                    ₹{bar.value}k
                                                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-earthy-900 rotate-45"></div>
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${idx === 5 ? 'text-emerald-700' : 'text-earthy-400 group-hover/bar:text-emerald-600'} transition-colors`}>{bar.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Selling Products */}
                                    <div className="bg-white rounded-2xl p-6 border border-earthy-100 shadow-lg relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        <h2 className="text-lg font-bold text-earthy-900 mb-5 font-display flex items-center gap-3 relative z-10">
                                            <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
                                            Top Products
                                        </h2>
                                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                                            {[
                                                { name: 'Pure Wheat Atta', sales: '1,234', growth: '+15%', color: 'from-amber-100 to-orange-100', text: 'text-orange-700' },
                                                { name: 'Beetroot Malt', sales: '985', growth: '+8%', color: 'from-red-100 to-pink-100', text: 'text-red-700' },
                                                { name: 'Ragi Noodles', sales: '856', growth: '+12%', color: 'from-earthy-200 to-stone-200', text: 'text-earthy-700' },
                                                { name: 'Millet Cookies', sales: '654', growth: '+5%', color: 'from-blue-100 to-indigo-100', text: 'text-blue-700' },
                                            ].map((product, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-earthy-50/30 hover:bg-white border border-transparent hover:border-earthy-100 transition-all hover:shadow-md group cursor-pointer">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center ${product.text} font-bold text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-earthy-900 text-sm group-hover:text-organic-700 transition-colors truncate">{product.name}</h4>
                                                        <p className="text-xs text-earthy-500">{product.sales} sales</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{product.growth}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-3 mt-4 text-center text-sm font-bold text-white bg-earthy-900 hover:bg-organic-600 rounded-xl transition-all shadow-lg shadow-earthy-900/20 hover:shadow-organic-600/30 flex items-center justify-center gap-2 group">
                                            View Full Report
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                                {/* Recent Activity */}
                                <div className="bg-white rounded-2xl p-6 border border-earthy-100 shadow-lg relative overflow-hidden mt-8">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-earthy-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                    <h2 className="text-lg font-bold text-earthy-900 mb-6 font-display flex items-center gap-3">
                                        <div className="w-1.5 h-5 bg-organic-500 rounded-full" />
                                        Recent System Activity
                                    </h2>
                                    <div className="space-y-6 relative z-10">
                                        {[
                                            { icon: Users, color: 'bg-blue-100 text-blue-600', text: 'New User Registration', time: '2 minutes ago' },
                                            { icon: ShoppingBag, color: 'bg-purple-100 text-purple-600', text: 'New Order #10234 Received', time: '15 minutes ago' },
                                            { icon: Package, color: 'bg-orange-100 text-orange-600', text: 'Product "Beetroot Malt" Updated', time: '1 hour ago' },
                                            { icon: Users, color: 'bg-blue-100 text-blue-600', text: 'New User Registration', time: '3 hours ago' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-earthy-50/80 transition-all cursor-pointer group border border-transparent hover:border-earthy-100">
                                                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    <item.icon size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-earthy-900 group-hover:text-organic-700 transition-colors">{item.text}</h4>
                                                    <p className="text-sm text-earthy-400 mt-1 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-earthy-300"></span>
                                                        {item.time}
                                                    </p>
                                                </div>
                                                <div className="text-earthy-300 group-hover:translate-x-1 transition-transform">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'orders' ? (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-[2rem] border border-earthy-100 shadow-xl overflow-hidden">
                                    {/* Header */}
                                    <div className="px-8 py-6 border-b border-earthy-100 bg-earthy-50/50 flex justify-between items-center">
                                        <h3 className="font-display font-bold text-xl text-earthy-900">Recent Orders</h3>
                                        <div className="flex gap-2">
                                            <button onClick={handleFilterOrders} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Filter</button>
                                            <button onClick={handleExportOrders} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Export</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white border-b border-earthy-100">
                                                <tr>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Order ID</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Customer</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Amount</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Date</th>
                                                    <th className="px-8 py-5 text-right text-xs font-bold text-earthy-400 uppercase tracking-widest">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-earthy-50">
                                                {orders.map((order, idx) => (
                                                    <tr key={order.id} className="group hover:bg-earthy-50/50 transition-colors cursor-default">
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-organic-50 text-organic-600 flex items-center justify-center font-bold text-sm border border-organic-100">
                                                                    #{order.id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-earthy-100 to-earthy-200 flex items-center justify-center text-earthy-600 font-bold text-sm">
                                                                    {(order.user_name || 'G')[0]}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-earthy-900">{order.user_name || 'Guest User'}</span>
                                                                    <span className="text-xs text-earthy-500 font-medium">{order.user_email || 'No email provided'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <span className={`px-4 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-full border 
                                                                ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                        order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                            'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Cancelled' ? 'bg-red-500' : order.status === 'Confirmed' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <span className="text-base font-bold text-earthy-900 font-display">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-earthy-500">
                                                            {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => handleOrderView(order.id)}
                                                                className="text-sm font-bold text-earthy-500 hover:text-organic-600 flex items-center gap-2 ml-auto p-2 hover:bg-organic-50 rounded-xl transition-all group/btn"
                                                            >
                                                                View Details
                                                                <div className="bg-earthy-100 group-hover/btn:bg-organic-100 p-1 rounded-full transition-colors">
                                                                    <ChevronRight size={14} />
                                                                </div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="px-8 py-16 text-center text-earthy-400">

                                                            No orders found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'users' ? (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-[2rem] border border-earthy-100 shadow-xl overflow-hidden">
                                    {/* Header */}
                                    <div className="px-8 py-6 border-b border-earthy-100 bg-earthy-50/50 flex justify-between items-center">
                                        <h3 className="font-display font-bold text-xl text-earthy-900">Registered Users</h3>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Export List</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white border-b border-earthy-100">
                                                <tr>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">User Profile</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Contact Info</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Joined Date</th>
                                                    <th className="px-8 py-5 text-left text-xs font-bold text-earthy-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-5 text-right text-xs font-bold text-earthy-400 uppercase tracking-widest">Activity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-earthy-50">
                                                {filteredUsers.map((user, idx) => (
                                                    <tr key={user.id} className="group hover:bg-earthy-50/50 transition-colors cursor-default">
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-organic-500 to-organic-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-organic-500/20">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-base font-bold text-earthy-900 group-hover:text-organic-700 transition-colors">{user.name}</div>
                                                                    <div className="text-xs text-earthy-400 font-medium">User ID: #{user.id.toString().padStart(4, '0')}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2 text-sm font-medium text-earthy-700">
                                                                    <div className="w-6 h-6 rounded-full bg-earthy-50 flex items-center justify-center text-earthy-400"><Mail size={12} /></div>
                                                                    {user.email}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm font-medium text-earthy-700">
                                                                    <div className="w-6 h-6 rounded-full bg-earthy-50 flex items-center justify-center text-earthy-400"><Phone size={12} /></div>
                                                                    {user.phone || 'No phone added'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-earthy-500">
                                                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap">
                                                            <span className="px-3 py-1 inline-flex items-center gap-2 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                Active Account
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                                            <button className="text-earthy-400 hover:text-organic-600 transition-colors p-2 hover:bg-earthy-50 rounded-lg">
                                                                <MoreHorizontal size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredUsers.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-16 text-center text-earthy-400">
                                                            No users found matching your search.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'products' ? (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Categories Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-earthy-900 font-display">Product Categories</h2>
                                        <span className="text-sm text-earthy-500">Manage category visibility & status</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="col-span-full border border-earthy-200 bg-earthy-50 p-4 rounded-xl text-earthy-700 text-sm mb-2 font-medium flex items-center gap-2">
                                            <Package size={16} /> These are the main categories displayed on the User Dashboard.
                                        </div>
                                        {categories.map((cat) => {
                                            // Determine styles based on category name
                                            let bgGradient = "from-earthy-500 to-earthy-700";
                                            let glowColor = "bg-earthy-500";
                                            let iconColor = "text-earthy-200";

                                            if (cat.name === 'Malt Beverages') {
                                                bgGradient = "from-pink-500 to-rose-600";
                                                glowColor = "bg-pink-500";
                                                iconColor = "text-pink-200";
                                            } else if (cat.name === 'Organic Atta') {
                                                bgGradient = "from-amber-400 to-orange-500";
                                                glowColor = "bg-amber-400";
                                                iconColor = "text-amber-200";
                                            } else if (cat.name === 'Snacks & Sweets') {
                                                bgGradient = "from-yellow-400 to-yellow-600";
                                                glowColor = "bg-yellow-400";
                                                iconColor = "text-yellow-200";
                                            } else if (cat.name === 'Noodles & Pasta') {
                                                bgGradient = "from-red-400 to-red-600";
                                                glowColor = "bg-red-400";
                                                iconColor = "text-red-200";
                                            } else if (cat.name === 'Wellness Products') {
                                                bgGradient = "from-emerald-500 to-teal-700";
                                                glowColor = "bg-emerald-500";
                                                iconColor = "text-emerald-200";
                                            }

                                            return (
                                                <motion.div
                                                    key={cat.id}
                                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        console.log("Category clicked:", cat.name);
                                                        setSelectedCategory(prev => prev === cat.name ? 'All' : cat.name);
                                                    }}
                                                    className={`bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative cursor-pointer flex flex-col ${selectedCategory === cat.name ? 'ring-4 ring-offset-4 ring-organic-500' : ''}`}
                                                >
                                                    {/* Card Header with Dynamic Gradient */}
                                                    <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
                                                        {/* Abstract background shapes */}
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 translate-y-[-10px]" />
                                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-x-[-10px] translate-y-10" />

                                                        {/* Icons/Watermarks */}
                                                        <div className={`absolute right-4 bottom-4 ${iconColor} opacity-30 transform rotate-12 group-hover:scale-110 transition-transform duration-500`}>
                                                            <Package size={80} strokeWidth={1.5} />
                                                        </div>

                                                        {/* Content Overlay */}
                                                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                                            <div className="flex justify-between items-start">
                                                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                                    {cat.status}
                                                                </span>

                                                                {/* Edit Button - Floating */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditClick(cat);
                                                                    }}
                                                                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-earthy-900 transition-all shadow-sm group-hover/btn"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                            </div>

                                                            <h3 className="text-2xl font-bold text-white font-display tracking-tight drop-shadow-md">
                                                                {cat.name}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                                                        <div className="grid grid-cols-2 gap-4 mt-1">
                                                            <div className="bg-earthy-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-earthy-100 group-hover:border-earthy-200 transition-colors">
                                                                <span className="text-earthy-400 text-xs font-bold uppercase tracking-wider mb-1">Stock</span>
                                                                <span className={`text-sm font-bold ${cat.stock === 'High' ? 'text-green-600' : cat.stock === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                    {cat.stock}
                                                                </span>
                                                            </div>
                                                            <div className="bg-earthy-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-earthy-100 group-hover:border-earthy-200 transition-colors">
                                                                <span className="text-earthy-400 text-xs font-bold uppercase tracking-wider mb-1">Items</span>
                                                                <span className="text-earthy-800 font-bold text-lg">
                                                                    {products.filter(p => p.category === cat.name).length}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {selectedCategory === cat.name && (
                                                            <div className="mt-4 text-center text-xs font-bold text-organic-600 bg-organic-50 py-2 rounded-xl border border-organic-100 flex items-center justify-center gap-2 animate-pulse">
                                                                <div className={`w-2 h-2 rounded-full ${glowColor}`} />
                                                                Currently Filtering
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-earthy-200 my-6" />

                                {/* Individual Products Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-xl font-bold text-earthy-900 font-display">Individual Inventory Items</h2>
                                            {selectedCategory !== 'All' && (
                                                <span className="bg-organic-100 text-organic-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                                    Category: {selectedCategory}
                                                    <button onClick={() => setSelectedCategory('All')} className="hover:text-organic-900"><X size={14} /></button>
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-earthy-500">Manage specific SKUs and products</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).length === 0 ? (
                                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-earthy-400 bg-white rounded-[2rem] border border-earthy-100 border-dashed">
                                                <Package size={64} className="mb-4 opacity-50" />
                                                <h3 className="text-xl font-bold text-earthy-600">No Inventory Items Found</h3>
                                                <p className="text-earthy-500 mt-2">Start by adding a new item to your catalog.</p>
                                            </div>
                                        ) : (
                                            products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((product) => (
                                                <div key={product.id} className="bg-white rounded-[2rem] border border-earthy-100 overflow-hidden shadow-lg hover:shadow-xl transition-all group relative flex flex-col">
                                                    {/* Product Card Content */}
                                                    <div className="h-48 bg-earthy-200 relative overflow-hidden">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-organic-600/20 to-organic-900/20 mix-blend-multiply flex items-center justify-center text-earthy-400">
                                                                <Package size={48} />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-earthy-900 shadow-sm border border-earthy-100">
                                                            {product.category}
                                                        </div>
                                                    </div>
                                                    <div className="p-6 flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-bold text-earthy-900 line-clamp-1">{product.name}</h3>
                                                            <span className="text-lg font-bold text-organic-600">₹{product.price}</span>
                                                        </div>
                                                        <p className="text-sm text-earthy-500 line-clamp-2 mb-4 flex-1">{product.description || 'No description available.'}</p>

                                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-earthy-100">
                                                            <span className={`text-sm font-medium flex items-center gap-1 ${product.stock > 10 ? 'text-green-600' :
                                                                product.stock > 0 ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                <Package size={14} />
                                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleProductEditClick(product)}
                                                                    className="p-2 rounded-lg text-organic-600 hover:bg-organic-50 hover:text-organic-700 transition-colors"
                                                                    title="Edit Product"
                                                                >
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(product)}
                                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                                    title="Delete Product"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Edit Modal */}
                    <AnimatePresence>
                        {editingCategory && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    onClick={() => setEditingCategory(null)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold font-display text-earthy-900">Edit Category</h3>
                                        <button
                                            onClick={() => setEditingCategory(null)}
                                            className="p-2 hover:bg-earthy-100 rounded-full transition-colors"
                                        >
                                            <X size={20} className="text-earthy-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-earthy-700 mb-1">Category Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-earthy-700 mb-1">Stock Level</label>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={editForm.stock}
                                                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                    sx={{
                                                        borderRadius: '0.75rem',
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#e5e7eb"
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#65a30d"
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#65a30d"
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="High">High</MenuItem>
                                                    <MenuItem value="Medium">Medium</MenuItem>
                                                    <MenuItem value="Low">Low</MenuItem>
                                                    <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => setEditingCategory(null)}
                                                className="flex-1 py-3 rounded-xl font-bold text-earthy-600 hover:bg-earthy-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex-1 py-3 rounded-xl font-bold text-white bg-organic-600 hover:bg-organic-700 transition-colors shadow-lg shadow-organic-600/30 flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} /> Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Add Product Modal */}
                    <AnimatePresence>
                        {isAddModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    onClick={() => setIsAddModalOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-[2rem] p-8 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                                >
                                    <style>{`
                                        .no-scrollbar::-webkit-scrollbar {
                                            width: 6px;
                                        }
                                        .no-scrollbar::-webkit-scrollbar-track {
                                            background: transparent;
                                        }
                                        .no-scrollbar::-webkit-scrollbar-thumb {
                                            background-color: #cbd5e1;
                                            border-radius: 20px;
                                        }
                                    `}</style>
                                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-earthy-100">
                                        <div>
                                            <h3 className="text-3xl font-bold font-display text-earthy-900">Add New Item</h3>
                                            <p className="text-earthy-500 text-sm mt-1">Fill in the details to add a new product to your catalog.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="p-2 hover:bg-earthy-100 rounded-full transition-colors text-earthy-400 hover:text-earthy-600"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddProduct} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Product Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-lg placeholder-earthy-300"
                                                placeholder="e.g. Premium Ragi Malt"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Category</label>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={newProduct.category}
                                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                        sx={{
                                                            height: '56px',
                                                            borderRadius: '1rem',
                                                            backgroundColor: 'rgba(255, 247, 237, 0.5)', // earthy-50/50
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e5e7eb"
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#65a30d"
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#65a30d"
                                                            },
                                                            fontSize: '1.125rem'
                                                        }}
                                                    >
                                                        <MenuItem value="Malt Beverages">Malt Beverages</MenuItem>
                                                        <MenuItem value="Organic Atta">Organic Atta</MenuItem>
                                                        <MenuItem value="Snacks & Sweets">Snacks & Sweets</MenuItem>
                                                        <MenuItem value="Noodles & Pasta">Noodles & Pasta</MenuItem>
                                                        <MenuItem value="Wellness Products">Wellness Products</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-lg placeholder-earthy-300"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-lg placeholder-earthy-300"
                                                    placeholder="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={newProduct.image_url}
                                                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-lg placeholder-earthy-300"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-earthy-700 mb-2 ml-1">Description</label>
                                            <textarea
                                                rows="3"
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-lg resize-none placeholder-earthy-300"
                                                placeholder="Product details, benefits, ingredients..."
                                            />
                                        </div>

                                        <div className="pt-8 flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                className="flex-1 py-4 rounded-xl font-bold text-earthy-600 hover:bg-earthy-50 hover:text-earthy-800 transition-all border border-transparent hover:border-earthy-200 text-lg"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-organic-600 to-organic-500 hover:from-organic-700 hover:to-organic-600 transition-all shadow-lg shadow-organic-600/30 hover:shadow-organic-600/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                                            >
                                                <Check size={24} /> Add Item
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isEditProductModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    onClick={() => setIsEditProductModalOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                    className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
                                >
                                    {/* Header with Pattern */}
                                    <div className="relative bg-[#14261C] p-8 md:p-10 text-white overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-110 mix-blend-overlay pointer-events-none" />
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-organic-500 rounded-full blur-[120px] opacity-20 translate-x-[20%] translate-y-[-40%]" />
                                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-10 translate-x-[-20%] translate-y-[20%]" />

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">Edit Inventory Item</h3>
                                                <div className="flex items-center gap-3 text-white/60">
                                                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-white/10 uppercase">ID: {productToEdit?.id}</span>
                                                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-white/10 uppercase">Last Updated: Just now</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsEditProductModalOpen(false)}
                                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80 hover:text-white backdrop-blur-sm"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF9F6]">
                                        <form onSubmit={handleEditProductSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Product Name</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-earthy-400 group-focus-within:text-organic-600 transition-colors">
                                                            <Package size={20} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={editProductForm.name}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                                                            className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-earthy-800 placeholder-earthy-300"
                                                            placeholder="Enter product name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Category</label>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={editProductForm.category}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                                                            displayEmpty
                                                            sx={{
                                                                borderRadius: '1rem',
                                                                backgroundColor: 'white',
                                                                fontFamily: 'inherit',
                                                                fontWeight: 500,
                                                                color: '#4b5563',
                                                                "& fieldset": { borderWidth: '2px', borderColor: '#e5e7eb' },
                                                                "&:hover fieldset": { borderColor: '#a3e635 !important' },
                                                                "&.Mui-focused fieldset": { borderColor: '#65a30d !important', borderWidth: '2px !important' },
                                                                padding: '6px'
                                                            }}
                                                        >
                                                            {categories.map(cat => (
                                                                <MenuItem key={cat.id} value={cat.name} sx={{ borderRadius: '0.75rem', margin: '4px', "&:hover": { backgroundColor: '#ecfccb', color: '#365314' } }}>{cat.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Price details</label>
                                                    <div className="relative">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-earthy-400 font-bold group-focus-within:text-organic-600 transition-colors">₹</div>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            value={editProductForm.price}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                                                            className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-bold text-lg text-earthy-900 placeholder-earthy-300"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="group">
                                                        <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Stock</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={editProductForm.stock}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                                                            className="w-full px-5 py-4 rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-earthy-800 placeholder-earthy-300"
                                                            placeholder="100"
                                                        />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Image Source</label>
                                                        <input
                                                            type="text"
                                                            value={editProductForm.image_url}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, image_url: e.target.value })}
                                                            className="w-full px-5 py-4 rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-earthy-800 placeholder-earthy-300"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-xs font-bold text-earthy-500 mb-2 ml-1 uppercase tracking-wider">Description</label>
                                                <textarea
                                                    rows="4"
                                                    value={editProductForm.description}
                                                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-earthy-800 resize-none placeholder-earthy-300 leading-relaxed"
                                                    placeholder="Describe the product features, benefits, and ingredients..."
                                                />
                                            </div>

                                            <div className="pt-8 flex gap-4 border-t border-earthy-200">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditProductModalOpen(false)}
                                                    className="px-8 py-4 rounded-xl font-bold text-earthy-600 hover:bg-earthy-100 hover:text-earthy-900 transition-all text-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-4 rounded-xl font-bold text-white bg-[#14261C] hover:bg-[#1f3a2b] transition-all shadow-lg shadow-[#14261C]/20 hover:shadow-[#14261C]/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
                                                >
                                                    <span>Update Inventory</span>
                                                    <div className="bg-white/20 p-1.5 rounded-full">
                                                        <Check size={18} />
                                                    </div>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Delete Confirmation Modal */}
                    <AnimatePresence>
                        {isDeleteModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="absolute inset-0 bg-earthy-900/40 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative z-10 overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-red-600" />

                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                                            <Trash2 size={32} />
                                        </div>

                                        <h2 className="text-2xl font-display font-bold text-earthy-900 mb-2">Delete Product?</h2>
                                        <p className="text-earthy-500 mb-8">
                                            Are you sure you want to delete <span className="font-bold text-earthy-800">"{productToDelete?.name}"</span>? This action cannot be undone.
                                        </p>

                                        <div className="flex gap-4 w-full">
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="flex-1 py-3 rounded-xl font-bold text-earthy-600 hover:bg-earthy-50 hover:text-earthy-800 transition-all border border-transparent hover:border-earthy-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmDeleteProduct}
                                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-600/30 transform hover:-translate-y-0.5"
                                            >
                                                Yes, Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Logout Confirmation Modal */}
                    <AnimatePresence>
                        {isLogoutModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="absolute inset-0 bg-earthy-900/40 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative z-10 overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-red-500" />

                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6">
                                            <LogOut size={32} />
                                        </div>

                                        <h2 className="text-2xl font-display font-bold text-earthy-900 mb-2">End Session?</h2>
                                        <p className="text-earthy-500 mb-8">
                                            Are you sure you want to sign out of the Admin Dashboard?
                                        </p>

                                        <div className="flex gap-4 w-full">
                                            <button
                                                onClick={() => setIsLogoutModalOpen(false)}
                                                className="flex-1 py-3 rounded-xl font-bold text-earthy-600 hover:bg-earthy-50 hover:text-earthy-800 transition-all border border-transparent hover:border-earthy-200"
                                            >
                                                Stay
                                            </button>
                                            <button
                                                onClick={confirmLogout}
                                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all shadow-lg shadow-orange-600/30 transform hover:-translate-y-0.5"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    {/* Order Details Modal */}
                    <AnimatePresence>
                        {isOrderDetailsModalOpen && selectedOrderDetails && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsOrderDetailsModalOpen(false)}
                                    className="absolute inset-0 bg-earthy-900/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
                                >
                                    {/* Modal Header */}
                                    <div className="px-8 py-6 border-b border-earthy-100 flex justify-between items-center bg-gradient-to-r from-earthy-50/80 to-white sticky top-0 z-20">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-2xl font-bold font-display text-earthy-900">Order Details</h2>
                                                <span className="bg-organic-50 text-organic-700 px-3 py-1 rounded-full text-sm font-bold border border-organic-100 flex items-center gap-1 shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-organic-500"></span>
                                                    #{selectedOrderDetails.id}
                                                </span>
                                            </div>
                                            <p className="text-earthy-500 text-sm flex items-center gap-2">
                                                Placed on <span className="font-medium text-earthy-700 bg-white/50 px-2 py-0.5 rounded-md border border-earthy-100/50">{new Date(selectedOrderDetails.created_at).toLocaleString()}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={handlePrintInvoice} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-earthy-200 rounded-xl text-sm font-bold text-earthy-600 hover:bg-earthy-50 transition-colors shadow-sm">
                                                <Printer size={16} />
                                                Print Invoice
                                            </button>
                                            <span className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 shadow-sm
                                                ${selectedOrderDetails.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    selectedOrderDetails.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        selectedOrderDetails.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {selectedOrderDetails.status === 'Delivered' ? <Check size={16} /> :
                                                    selectedOrderDetails.status === 'Cancelled' ? <X size={16} /> :
                                                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                                                {selectedOrderDetails.status}
                                            </span>
                                            <div className="h-8 w-px bg-earthy-200 mx-1"></div>
                                            <button onClick={() => setIsOrderDetailsModalOpen(false)} className="bg-earthy-50 p-2 rounded-full hover:bg-earthy-100 transition-colors border border-earthy-100 text-earthy-500 hover:text-earthy-900">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modal Content - Scrollable */}
                                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-white to-earthy-50/30">

                                        {/* Info Cards Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {[
                                                {
                                                    icon: User, title: 'Customer', content: (
                                                        <>
                                                            <p className="font-bold text-earthy-900 text-lg mb-0.5">{selectedOrderDetails.user_name || 'Guest'}</p>
                                                            <p className="text-earthy-500 text-sm mb-1">{selectedOrderDetails.user_email}</p>
                                                            <p className="text-earthy-500 text-sm flex items-center gap-2 mt-2"><span className="w-6 h-6 rounded-full bg-earthy-100 flex items-center justify-center text-earthy-500"><Phone size={12} /></span> {selectedOrderDetails.phone || 'No phone'}</p>
                                                        </>
                                                    )
                                                },
                                                {
                                                    icon: DollarSign, title: 'Payment', content: (
                                                        <>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-earthy-500 text-sm">Method</span>
                                                                <span className="font-bold text-earthy-800 bg-white px-2 py-0.5 rounded border border-earthy-100">{selectedOrderDetails.payment_method || 'Online'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-earthy-100/50">
                                                                <span className="text-earthy-500 text-sm font-medium">Total Paid</span>
                                                                <span className="font-bold text-organic-700 text-xl font-display">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                            </div>
                                                        </>
                                                    )
                                                },
                                                {
                                                    icon: Package, title: 'Shipping', content: (
                                                        <p className="text-sm text-earthy-600 leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-earthy-100/50 mt-1">
                                                            {selectedOrderDetails.shipping_address
                                                                ? (typeof selectedOrderDetails.shipping_address === 'string' && selectedOrderDetails.shipping_address.startsWith('{')
                                                                    ? 'Address details available on file'
                                                                    : selectedOrderDetails.shipping_address)
                                                                : 'No shipping address provided.'}
                                                        </p>
                                                    )
                                                }
                                            ].map((card, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-white to-earthy-50/50 p-6 rounded-2xl border border-earthy-100 shadow-sm hover:shadow-lg hover:translate-y-[-2px] hover:border-organic-100 transition-all duration-300 group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-organic-50 rounded-full blur-3xl -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100"></div>
                                                    <div className="flex items-center gap-4 mb-5 relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-organic-500 to-organic-600 text-white flex items-center justify-center shadow-lg shadow-organic-500/20 group-hover:rotate-6 transition-transform duration-300">
                                                            <card.icon size={22} />
                                                        </div>
                                                        <h4 className="font-bold text-earthy-400 uppercase tracking-widest text-xs">{card.title}</h4>
                                                    </div>
                                                    <div className="pl-1 relative z-10">
                                                        {card.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Items Section */}
                                        <div className="bg-white rounded-[1.5rem] border border-earthy-100 shadow-sm overflow-hidden flex flex-col">
                                            <div className="px-8 py-5 bg-gradient-to-r from-earthy-50/50 to-white border-b border-earthy-100 flex justify-between items-center">
                                                <h3 className="font-bold text-earthy-900 flex items-center gap-2 text-lg">
                                                    Order Items
                                                    <span className="px-2 py-0.5 rounded-full bg-organic-100 text-organic-700 text-xs font-bold border border-organic-200">
                                                        {selectedOrderDetails.items ? selectedOrderDetails.items.length : 0}
                                                    </span>
                                                </h3>
                                            </div>

                                            <div>
                                                {selectedOrderDetails.isLoading ? (
                                                    <div className="flex justify-center p-12">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-600"></div>
                                                    </div>
                                                ) : selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                                                    <div className="divide-y divide-earthy-50">
                                                        {selectedOrderDetails.items.map((item, idx) => (
                                                            <div key={idx} className="p-6 flex items-center gap-6 hover:bg-earthy-50/20 transition-colors group">
                                                                {/* Product Icon/Image Placeholder */}
                                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-earthy-50 to-earthy-100 flex items-center justify-center text-earthy-400 border border-earthy-100 group-hover:border-organic-200 group-hover:from-organic-50 group-hover:to-white group-hover:text-organic-600 transition-all shadow-inner">
                                                                    <Leaf size={28} />
                                                                </div>

                                                                {/* Product Details */}
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-earthy-900 text-xl mb-1 font-display">{item.product_name}</h4>
                                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-earthy-500">
                                                                        <span className="font-mono text-xs bg-earthy-50 px-2 py-0.5 rounded border border-earthy-100">ID: {item.product_id || 'N/A'}</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-earthy-400">Unit Price:</span>
                                                                            <span className="font-bold text-earthy-700">₹{parseFloat(item.price).toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Quantity Badge */}
                                                                <div className="hidden md:block">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span className="text-xs text-earthy-400 uppercase font-bold tracking-wider">Qty</span>
                                                                        <div className="px-4 py-1.5 rounded-xl bg-earthy-50 border border-earthy-200 text-earthy-900 font-bold text-lg min-w-[3rem] text-center shadow-sm">
                                                                            {item.quantity}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Total Price */}
                                                                <div className="text-right min-w-[120px]">
                                                                    <span className="text-xs text-earthy-400 uppercase font-bold tracking-wider mb-1 block">Total</span>
                                                                    <span className="block font-bold text-earthy-900 text-xl font-display">₹{(item.quantity * item.price).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-12">
                                                        <p className="text-earthy-400">No items found for this order.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Summary Footer */}
                                            <div className="bg-gradient-to-b from-white to-earthy-50 p-8 border-t border-earthy-100">
                                                <div className="flex flex-col gap-3 max-w-sm ml-auto bg-white p-6 rounded-2xl border border-earthy-100 shadow-lg shadow-earthy-100/50">
                                                    <div className="flex justify-between text-earthy-500 text-sm">
                                                        <span>Subtotal</span>
                                                        <span>₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-earthy-500 text-sm">
                                                        <span>Shipping</span>
                                                        <span className="text-emerald-600 font-bold">Free</span>
                                                    </div>
                                                    <div className="w-full h-px bg-dashed border-t border-dashed border-earthy-200 my-1"></div>
                                                    <div className="flex justify-between text-earthy-900 items-end">
                                                        <span className="font-bold">Total Amount</span>
                                                        <span className="text-organic-700 text-3xl font-bold font-display">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
