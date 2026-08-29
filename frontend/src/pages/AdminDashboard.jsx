import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Package, LayoutDashboard, Search, TrendingUp, DollarSign, ShoppingBag, Leaf, User, X, Check, Edit2, ClipboardList, ChevronRight, Trash2, LogOut, AlertCircle, Printer, Phone, Mail, MoreHorizontal, Menu, UploadCloud, Image as ImageIcon, Loader2, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import html2pdf from 'html2pdf.js';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminDashboard = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Category Management State (Product Groups)
    const [categories, setCategories] = useState([
        { id: 1, name: 'Malt Beverages', status: 'Active', stock: 'High', count: 0 },
        { id: 2, name: 'Organic Atta', status: 'Active', stock: 'High', count: 0 },
        { id: 3, name: 'Snacks & Sweets', status: 'Active', stock: 'High', count: 0 },
        { id: 4, name: 'Noodles & Pasta', status: 'Active', stock: 'Medium', count: 0 },
        { id: 5, name: 'Wellness Products', status: 'Active', stock: 'Low', count: 0 },
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
            await axios.put(`${API_URL}/products/${productToEdit.id}`, editProductForm, {
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
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleFileUpload = async (e, targetForm = 'new') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setNotification({ type: 'error', message: 'Please select an image file (JPEG, PNG, WebP).' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        setUploadingImage(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', file);

            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token
                }
            });

            if (res.data && res.data.url) {
                if (targetForm === 'new') {
                    setNewProduct(prev => ({ ...prev, image_url: res.data.url }));
                } else {
                    setEditProductForm(prev => ({ ...prev, image_url: res.data.url }));
                }
                setNotification({ type: 'success', message: 'Image uploaded successfully to Cloudinary!' });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            setNotification({ type: 'error', message: 'Failed to upload image. Please try again.' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setNotification({ type: 'error', message: 'Authentication token missing. Please login again.' });
                return;
            }

            await axios.post(`${API_URL}/products`, newProduct, {
                headers: { 'x-auth-token': token }
            });

            setIsAddModalOpen(false);
            setNewProduct({ name: '', category: 'Malt Beverages', price: '', stock: '', description: '', image_url: '' });

            // Show Premium Success Notification
            setNotification({ type: 'success', message: 'Product successfully added to inventory!' });
            setTimeout(() => setNotification(null), 3000);

            const productsRes = await axios.get(`${API_URL}/products`);
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
            await axios.delete(`${API_URL}/products/${productToDelete.id}`, {
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
                        axios.get(`${API_URL}/admin/stats`),
                        axios.get(`${API_URL}/admin/users`),
                        axios.get(`${API_URL}/admin/orders`),
                        axios.get(`${API_URL}/products`)
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
            const res = await axios.get(`${API_URL}/admin/orders/${orderId}`, {
                headers: { 'x-auth-token': token }
            });

            setSelectedOrderDetails(res.data);
        } catch (err) {
            console.error("Error fetching order details", err);
            setNotification({ type: 'error', message: 'Failed to load full order details' });
        }
    };

    const [isPdfDownloading, setIsPdfDownloading] = useState(false);

    const parseInvoiceShippingInfo = (order) => {
        let name = order?.user_name || 'Valued Customer';
        let email = order?.user_email || 'N/A';
        let phone = order?.user_phone || order?.phone || 'N/A';
        let address = 'Standard Delivery';
        let pincode = '';

        if (order?.shipping_address) {
            const raw = order.shipping_address;
            if (typeof raw === 'object') {
                const fullName = `${raw.firstName || ''} ${raw.lastName || ''}`.trim();
                if (fullName) name = fullName;
                if (raw.email) email = raw.email;
                if (raw.mobile || raw.phone) phone = raw.mobile || raw.phone;
                if (raw.address || raw.address_line) address = raw.address || raw.address_line;
                if (raw.pincode) pincode = raw.pincode;
            } else if (typeof raw === 'string') {
                try {
                    if (raw.trim().startsWith('{')) {
                        const parsed = JSON.parse(raw);
                        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
                        if (fullName) name = fullName;
                        if (parsed.email) email = parsed.email;
                        if (parsed.mobile || parsed.phone) phone = parsed.mobile || parsed.phone;
                        if (parsed.address || parsed.address_line) address = parsed.address || parsed.address_line;
                        if (parsed.pincode) pincode = parsed.pincode;
                    } else {
                        address = raw;
                    }
                } catch (e) {
                    address = raw;
                }
            }
        }
        return { name, email, phone, address, pincode };
    };

    const getInvoiceHTMLString = (order) => {
        if (!order) return '';
        const { name, email, phone, address, pincode } = parseInvoiceShippingInfo(order);
        const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const paymentMethod = (order.payment_method || 'Online / UPI').toUpperCase();
        const totalAmount = parseFloat(order.total_amount || 0).toFixed(2);
        const items = order.items && order.items.length > 0 ? order.items : [];

        const itemsRows = items.map((item, idx) => `
            <tr>
                <td style="padding: 12px 14px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; text-align: center;">${idx + 1}</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-weight: 700; color: #111827; font-size: 14px;">${item.product_name || 'Purazya Organic Product'}</div>
                    <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 2px;">SKU / ID: #${item.product_id || idx + 1}</div>
                </td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-size: 13px; font-weight: 600;">₹${parseFloat(item.price || 0).toFixed(2)}</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #111827; font-size: 13px; font-weight: 700;">${item.quantity || 1}</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #166534; font-size: 14px; font-weight: 700;">₹${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Purazya_Invoice_Order_${order.id}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1f2937; padding: 28px; line-height: 1.5; }
                    .invoice-wrapper { max-width: 800px; margin: 0 auto; background: #ffffff; }
                    .header-table { width: 100%; border-bottom: 2px solid #15803d; padding-bottom: 20px; margin-bottom: 24px; }
                    .brand-name { font-size: 26px; font-weight: 900; color: #14532d; letter-spacing: -0.5px; }
                    .brand-tagline { font-size: 11px; color: #15803d; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
                    .brand-sub { font-size: 12px; color: #6b7280; margin-top: 4px; }
                    .invoice-title { font-size: 28px; font-weight: 900; color: #111827; text-align: right; letter-spacing: 1px; }
                    .invoice-badge { display: inline-block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 800; font-size: 13px; padding: 3px 10px; border-radius: 6px; margin-top: 6px; }
                    .info-grid { width: 100%; margin-bottom: 24px; }
                    .party-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; vertical-align: top; }
                    .party-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #15803d; margin-bottom: 6px; }
                    .party-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
                    .party-detail { font-size: 13px; color: #4b5563; line-height: 1.4; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 8px; overflow: hidden; }
                    .items-table th { background: #14532d; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 14px; text-align: left; }
                    .summary-grid { width: 100%; margin-top: 10px; }
                    .totals-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; width: 320px; margin-left: auto; }
                    .totals-row { display: flex; justify-content: space-between; font-size: 13px; color: #374151; margin-bottom: 8px; }
                    .grand-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #14532d; border-top: 1.5px dashed #86efac; padding-top: 10px; margin-top: 6px; }
                    .footer-note { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; font-size: 12px; color: #9ca3af; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-wrapper" id="invoice-printable-content">
                    <table class="header-table">
                        <tr>
                            <td style="vertical-align: top;">
                                <div class="brand-name">Purazya LIFE</div>
                                <div class="brand-tagline">Where Purity Becomes a Habit</div>
                                <div class="brand-sub">Organic Foods & Wellness Products<br>Support: support@Purazya.com</div>
                            </td>
                            <td style="text-align: right; vertical-align: top;">
                                <div class="invoice-title">INVOICE</div>
                                <div><span class="invoice-badge">ORDER #${order.id}</span></div>
                                <div style="font-size: 12px; color: #6b7280; margin-top: 6px;">Date: <strong style="color: #111827;">${orderDate}</strong></div>
                                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Payment: <strong style="color: #111827;">${paymentMethod}</strong></div>
                            </td>
                        </tr>
                    </table>

                    <table class="info-grid" style="border-spacing: 12px 0; margin-left: -12px; width: calc(100% + 24px);">
                        <tr>
                            <td class="party-card" style="width: 50%;">
                                <div class="party-label">Billed To</div>
                                <div class="party-name">${name}</div>
                                <div class="party-detail">${email !== 'N/A' ? '<strong>Email:</strong> ' + email : ''}</div>
                                <div class="party-detail">${phone !== 'N/A' ? '<strong>Phone:</strong> ' + phone : ''}</div>
                            </td>
                            <td class="party-card" style="width: 50%;">
                                <div class="party-label">Shipped To</div>
                                <div class="party-name">${name}</div>
                                <div class="party-detail">${address}</div>
                                ${pincode ? `<div class="party-detail"><strong>PIN Code:</strong> ${pincode}</div>` : ''}
                                <div class="party-detail">${phone !== 'N/A' ? '<strong>Mobile:</strong> ' + phone : ''}</div>
                            </td>
                        </tr>
                    </table>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 8%; text-align: center;">#</th>
                                <th style="width: 50%;">Item Description</th>
                                <th style="width: 14%; text-align: right;">Unit Price</th>
                                <th style="width: 10%; text-align: center;">Qty</th>
                                <th style="width: 18%; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsRows}
                        </tbody>
                    </table>

                    <table class="summary-grid">
                        <tr>
                            <td style="vertical-align: top; padding-right: 20px;">
                                <div style="background: #fdfbf7; border: 1px solid #fde68a; border-radius: 10px; padding: 14px; font-size: 12px; color: #78350f;">
                                    <strong style="display: block; margin-bottom: 4px; font-size: 13px;">🌿 100% Certified Organic Guarantee</strong>
                                    Crafted with love from natural farm-fresh ingredients without chemical preservatives or artificial sweeteners.
                                </div>
                            </td>
                            <td style="vertical-align: top; width: 320px;">
                                <div class="totals-card">
                                    <div class="totals-row">
                                        <span>Subtotal</span>
                                        <span style="font-weight: 600;">₹${totalAmount}</span>
                                    </div>
                                    <div class="totals-row">
                                        <span>Delivery & Shipping</span>
                                        <span style="color: #15803d; font-weight: 700;">FREE</span>
                                    </div>
                                    <div class="totals-row">
                                        <span>Taxes & GST</span>
                                        <span style="color: #6b7280;">Included</span>
                                    </div>
                                    <div class="grand-total-row">
                                        <span>Total Paid</span>
                                        <span>₹${totalAmount}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div class="footer-note">
                        <p style="font-weight: 600; color: #4b5563; margin-bottom: 2px;">Thank you for shopping with Purazya!</p>
                        <p>This is a computer-generated tax invoice and requires no signature.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const handlePrintInvoice = () => {
        if (!selectedOrderDetails) return;
        const html = getInvoiceHTMLString(selectedOrderDetails);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setNotification({ type: 'error', message: 'Popup blocked. Please allow popups for printing.' });
            return;
        }
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    const handleDownloadPDF = async () => {
        if (!selectedOrderDetails) return;
        setIsPdfDownloading(true);
        try {
            const html = getInvoiceHTMLString(selectedOrderDetails);
            const container = document.createElement('div');
            container.innerHTML = html;
            const element = container.querySelector('#invoice-printable-content') || container;

            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Purazya_Invoice_Order_${selectedOrderDetails.id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
            setNotification({ type: 'success', message: `Invoice for Order #${selectedOrderDetails.id} downloaded successfully!` });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('PDF generation error:', error);
            setNotification({ type: 'error', message: 'Failed to download PDF invoice' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsPdfDownloading(false);
        }
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setIsMobileMenuOpen(false);
            }}
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
            className="group relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-white border border-earthy-100 shadow-md hover:shadow-xl transition-all"
        >
            {/* Decorative Background Blob */}
            <div className={`absolute -right-6 -top-6 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ${color.split(' ')[1]}`} />

            <div className="relative z-10 flex justify-between items-start mb-2 sm:mb-3">
                <div className={`p-2 sm:p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4 h-4 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-earthy-900 mb-0.5 sm:mb-1 tracking-tight truncate">{value}</h3>
                <p className="text-earthy-500 font-medium text-[10px] sm:text-xs border-l-2 border-earthy-200 pl-2 sm:pl-3 uppercase tracking-wider truncate">{title}</p>
            </div>

            <div className="mt-2.5 sm:mt-4 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-100">
                <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="truncate">+12% vs last mo</span>
            </div>
        </motion.div>
    );



    return (
        <div className="min-h-screen bg-earthy-50 font-sans flex flex-col lg:flex-row relative">
            {/* Mobile Top Navbar with Hamburger */}
            <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-earthy-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-organic-600 rounded-lg flex items-center justify-center">
                        <Leaf className="text-white" size={16} />
                    </div>
                    <span className="text-lg font-display font-bold text-earthy-900 tracking-tight">Purazya<span className="text-organic-600">Admin</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-xl bg-earthy-100 text-earthy-700 hover:bg-earthy-200 transition-colors flex items-center justify-center"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Backdrop & Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden flex justify-end"
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-72 max-w-[80vw] bg-white h-full p-5 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-earthy-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-organic-600 rounded-lg flex items-center justify-center">
                                        <Leaf className="text-white" size={18} />
                                    </div>
                                    <span className="text-lg font-display font-bold text-earthy-900 tracking-tight">Purazya<span className="text-organic-600">Admin</span></span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1.5 rounded-lg text-earthy-400 hover:bg-earthy-100 hover:text-earthy-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-1.5 flex-1">
                                <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <SidebarItem id="orders" icon={ClipboardList} label="Orders" />
                                <SidebarItem id="users" icon={Users} label="Users" />
                                <SidebarItem id="products" icon={Package} label="Products" />
                            </div>

                            <div className="mt-auto border-t border-earthy-100 pt-4">
                                <div className="flex items-center gap-3 px-2 mb-4">
                                    <div className="w-9 h-9 rounded-full bg-earthy-100 flex items-center justify-center text-earthy-600 font-bold text-sm">
                                        {user?.name?.[0] || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-earthy-900 truncate">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-earthy-500 truncate">{user?.email || 'admin@Purazya.com'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
                                >
                                    <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                                        <LogOut size={16} />
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-earthy-100 h-screen fixed left-0 top-0 z-40 p-6 hidden lg:flex flex-col">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-organic-600 rounded-lg flex items-center justify-center">
                        <Leaf className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-display font-bold text-earthy-900 tracking-tight">Purazya<span className="text-organic-600">Admin</span></span>
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
                            <p className="text-xs text-earthy-500 truncate">{user?.email || 'admin@Purazya.com'}</p>
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
            <div className="flex-1 lg:ml-64 p-3.5 sm:p-6 lg:p-8 pt-4 sm:pt-6 lg:pt-8 transition-all duration-300 min-w-0">
                <div className="max-w-7xl mx-auto relative">
                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -50, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: -50, x: '-50%' }}
                                className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 w-[clamp(16rem,90vw,22rem)] max-w-[calc(100vw-2rem)] justify-center
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
                    <div className="flex flex-row justify-between items-center mb-3 md:mb-8 gap-2 md:gap-4">
                        <div>
                            <h1 className="text-lg sm:text-2xl font-display font-bold text-earthy-900 leading-tight">
                                {activeTab === 'dashboard' && 'Overview'}
                                {activeTab === 'orders' && 'Order Management'}
                                {activeTab === 'users' && 'User Management'}
                                {activeTab === 'products' && 'Product Catalog'}
                            </h1>
                            <p className="text-earthy-500 text-[11px] sm:text-sm mt-0.5 md:mt-1">Welcome back, Master Admin</p>
                        </div>
                        {activeTab === 'users' && (
                            <div className="relative w-auto">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-earthy-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-earthy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-organic-500/50 w-28 sm:w-48 md:w-64 transition-all"
                                />
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-organic-600 hover:bg-organic-700 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-organic-600/30 flex items-center gap-1.5 sm:gap-2 transition-all shrink-0"
                            >
                                <Package size={14} className="sm:w-4 sm:h-4" /> <span>Add Item</span>
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
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
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
                                                    <span className="text-2xl font-bold text-earthy-900 font-display">₹{stats.totalRevenue || 0}</span>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                                                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                                                    </span>
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
                                                        backgroundColor: '#f9fafb',
                                                        color: '#4b5563',
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem',
                                                        border: '1px solid #e5e7eb',
                                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                        '&:hover': { backgroundColor: '#f3f4f6' },
                                                        '&.Mui-focused': {
                                                            backgroundColor: '#ffffff',
                                                            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
                                                        },
                                                        '& .MuiSelect-icon': { color: '#4b5563' }
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

                                            {/* Bars (Dynamically calculated from real orders) */}
                                            {(() => {
                                                const months = Array.from({ length: 6 }, (_, i) => {
                                                    const d = new Date();
                                                    d.setMonth(d.getMonth() - (5 - i));
                                                    return {
                                                        label: d.toLocaleString('default', { month: 'short' }),
                                                        month: d.getMonth(),
                                                        year: d.getFullYear(),
                                                        total: 0
                                                    };
                                                });

                                                orders.forEach(o => {
                                                    const d = new Date(o.created_at);
                                                    const target = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
                                                    if (target) {
                                                        target.total += parseFloat(o.total_amount || 0);
                                                    }
                                                });

                                                const maxTotal = Math.max(...months.map(m => m.total), 100);

                                                return (
                                                    <div className="absolute inset-0 flex items-end justify-between gap-4 px-2 pt-4">
                                                        {months.map((bar, idx) => {
                                                            const heightPercent = bar.total > 0 ? Math.max(10, Math.round((bar.total / maxTotal) * 100)) : 6;
                                                            const isCurrentMonth = idx === 5;

                                                            return (
                                                                <div key={idx} className="flex flex-col items-center gap-3 w-full h-full justify-end group/bar cursor-pointer">
                                                                    <div className="w-full max-w-[60px] relative h-full flex items-end">
                                                                        <motion.div
                                                                            initial={{ height: 0 }}
                                                                            animate={{ height: `${heightPercent}%` }}
                                                                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                                                                            className={`w-full rounded-t-xl relative transition-all duration-300 ${bar.total > 0
                                                                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20'
                                                                                : 'bg-earthy-100/60 group-hover/bar:bg-emerald-200'
                                                                                }`}
                                                                        >
                                                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-earthy-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-200 whitespace-nowrap z-20 shadow-xl scale-90 group-hover/bar:scale-100 pointer-events-none">
                                                                                ₹{bar.total}
                                                                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-earthy-900 rotate-45"></div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </div>
                                                                    <span className={`text-xs font-bold uppercase tracking-wider ${isCurrentMonth ? 'text-emerald-700 font-extrabold' : 'text-earthy-400 group-hover/bar:text-emerald-600'} transition-colors`}>
                                                                        {bar.label}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Top Products (Live from database) */}
                                    <div className="bg-white rounded-2xl p-6 border border-earthy-100 shadow-lg relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        <h2 className="text-lg font-bold text-earthy-900 mb-5 font-display flex items-center gap-3 relative z-10">
                                            <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
                                            Active Inventory ({products.length})
                                        </h2>
                                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                                            {products.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                                                    <Package className="w-10 h-10 text-earthy-300 mb-2" />
                                                    <p className="text-xs font-bold text-earthy-600">No products in inventory yet</p>
                                                    <p className="text-[11px] text-earthy-400 mt-0.5">Click "+ Add Item" to add products</p>
                                                </div>
                                            ) : (
                                                products.slice(0, 5).map((product, idx) => (
                                                    <div key={product.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-earthy-50/40 hover:bg-white border border-transparent hover:border-earthy-100 transition-all hover:shadow-sm group">
                                                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-earthy-100 shrink-0 border border-earthy-200">
                                                            {product.image_url ? (
                                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-earthy-500">#{idx + 1}</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-earthy-900 text-xs truncate group-hover:text-organic-700 transition-colors">{product.name}</h4>
                                                            <p className="text-[11px] text-earthy-500">₹{product.price} • Stock: {product.stock || 0}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-organic-700 bg-organic-50 px-2 py-0.5 rounded border border-organic-100 truncate max-w-[80px]">
                                                            {product.category}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('products')}
                                            className="w-full py-2.5 mt-4 text-center text-xs font-bold text-white bg-earthy-900 hover:bg-organic-600 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                                        >
                                            View Product Catalog
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Activity (Live from real database records) */}
                                <div className="bg-white rounded-2xl p-6 border border-earthy-100 shadow-lg relative overflow-hidden mt-2">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-earthy-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                    <h2 className="text-lg font-bold text-earthy-900 mb-5 font-display flex items-center gap-3">
                                        <div className="w-1.5 h-5 bg-organic-500 rounded-full" />
                                        Recent System Activity
                                    </h2>
                                    <div className="space-y-3 relative z-10">
                                        {(() => {
                                            const activities = [];

                                            // Real recent users
                                            users.slice(0, 3).forEach(u => {
                                                activities.push({
                                                    icon: Users,
                                                    color: 'bg-blue-100 text-blue-600',
                                                    title: `User "${u.name}" registered`,
                                                    date: new Date(u.created_at)
                                                });
                                            });

                                            // Real recent orders
                                            orders.slice(0, 3).forEach(o => {
                                                activities.push({
                                                    icon: ShoppingBag,
                                                    color: 'bg-emerald-100 text-emerald-600',
                                                    title: `Order #${o.id} placed by ${o.user_name || 'Customer'} (₹${o.total_amount})`,
                                                    date: new Date(o.created_at)
                                                });
                                            });

                                            // Real recent products
                                            products.slice(0, 2).forEach(p => {
                                                activities.push({
                                                    icon: Package,
                                                    color: 'bg-orange-100 text-orange-600',
                                                    title: `Product "${p.name}" added to inventory`,
                                                    date: p.created_at ? new Date(p.created_at) : new Date()
                                                });
                                            });

                                            activities.sort((a, b) => b.date - a.date);

                                            if (activities.length === 0) {
                                                return (
                                                    <div className="py-8 text-center text-earthy-400 text-xs">
                                                        No recent activity recorded yet. Activity will appear as users register and place orders.
                                                    </div>
                                                );
                                            }

                                            return activities.slice(0, 5).map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-earthy-50/80 transition-all border border-transparent hover:border-earthy-100">
                                                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shadow-sm shrink-0`}>
                                                        <item.icon size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-earthy-900 text-xs truncate">{item.title}</h4>
                                                        <p className="text-[11px] text-earthy-400 mt-0.5">
                                                            {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
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
                                <div className="bg-white rounded-2xl md:rounded-[2rem] border border-earthy-100 shadow-md md:shadow-xl overflow-hidden">
                                    {/* Header */}
                                    <div className="p-3.5 sm:p-5 md:px-8 md:py-6 border-b border-earthy-100 bg-earthy-50/50 flex justify-between items-center gap-2">
                                        <h3 className="font-display font-bold text-base sm:text-lg md:text-xl text-earthy-900">Recent Orders</h3>
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <button onClick={handleFilterOrders} className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Filter</button>
                                            <button onClick={handleExportOrders} className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Export</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white border-b border-earthy-100">
                                                <tr>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Order ID</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Customer</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Status</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Amount</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Date</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-right text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-earthy-50">
                                                {orders.map((order, idx) => (
                                                    <tr key={order.id} className="group hover:bg-earthy-50/50 transition-colors">
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-earthy-100 flex items-center justify-center text-earthy-700 font-bold text-xs sm:text-sm">
                                                                    #{order.id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-2.5 sm:gap-4">
                                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-earthy-100 to-earthy-200 flex items-center justify-center text-earthy-600 font-bold text-xs sm:text-sm shrink-0">
                                                                    {(order.user_name || 'G')[0]}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs sm:text-sm font-bold text-earthy-900">{order.user_name || 'Guest User'}</span>
                                                                    <span className="text-[10px] sm:text-xs text-earthy-500 font-medium">{order.user_email || 'No email provided'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <span className={`px-2.5 py-1 sm:px-4 sm:py-1.5 inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold rounded-full border 
                                                                ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                        order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                            'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Cancelled' ? 'bg-red-500' : order.status === 'Confirmed' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <span className="text-xs sm:text-base font-bold text-earthy-900 font-display">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap text-xs sm:text-sm font-medium text-earthy-500">
                                                            {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => handleOrderView(order.id)}
                                                                className="text-xs sm:text-sm font-bold text-earthy-500 hover:text-organic-600 inline-flex items-center gap-1 sm:gap-2 ml-auto p-1.5 sm:p-2 hover:bg-organic-50 rounded-xl transition-all group/btn"
                                                            >
                                                                <span className="hidden sm:inline">View Details</span>
                                                                <span className="sm:hidden">View</span>
                                                                <div className="bg-earthy-100 group-hover/btn:bg-organic-100 p-1 rounded-full transition-colors">
                                                                    <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                                                                </div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="px-4 py-12 text-center text-earthy-400 text-xs sm:text-sm">
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
                                <div className="bg-white rounded-2xl md:rounded-[2rem] border border-earthy-100 shadow-md md:shadow-xl overflow-hidden">
                                    {/* Header */}
                                    <div className="p-3.5 sm:p-5 md:px-8 md:py-6 border-b border-earthy-100 bg-earthy-50/50 flex justify-between items-center gap-2">
                                        <h3 className="font-display font-bold text-base sm:text-lg md:text-xl text-earthy-900">Registered Users</h3>
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <button className="px-2.5 py-1 sm:px-4 sm:py-2 bg-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-earthy-600 border border-earthy-200 hover:bg-earthy-50 hover:border-earthy-300 transition-all shadow-sm">Export List</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white border-b border-earthy-100">
                                                <tr>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">User Profile</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Contact Info</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Joined Date</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-left text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Status</th>
                                                    <th className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-right text-[10px] sm:text-xs font-bold text-earthy-400 uppercase tracking-wider md:tracking-widest">Activity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-earthy-50">
                                                {filteredUsers.map((user, idx) => (
                                                    <tr key={user.id} className="group hover:bg-earthy-50/50 transition-colors cursor-default">
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <div className="flex items-center gap-2.5 sm:gap-4">
                                                                <div className="h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-organic-500 to-organic-700 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md shadow-organic-500/20">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs sm:text-base font-bold text-earthy-900 group-hover:text-organic-700 transition-colors">{user.name}</div>
                                                                    <div className="text-[10px] sm:text-xs text-earthy-400 font-medium">User ID: #{user.id.toString().padStart(4, '0')}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <div className="flex flex-col gap-0.5 sm:gap-1">
                                                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-earthy-700">
                                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-earthy-50 flex items-center justify-center text-earthy-400"><Mail size={10} className="sm:w-3 sm:h-3" /></div>
                                                                    {user.email}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-earthy-700">
                                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-earthy-50 flex items-center justify-center text-earthy-400"><Phone size={10} className="sm:w-3 sm:h-3" /></div>
                                                                    {user.phone || 'No phone added'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap text-xs sm:text-sm font-medium text-earthy-500">
                                                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap">
                                                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                Active Account
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 whitespace-nowrap text-right">
                                                            <button className="text-earthy-400 hover:text-organic-600 transition-colors p-1.5 sm:p-2 hover:bg-earthy-50 rounded-lg">
                                                                <MoreHorizontal size={16} className="sm:w-5 sm:h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredUsers.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-4 py-12 text-center text-earthy-400 text-xs sm:text-sm">
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
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 sm:mb-4 gap-0.5 sm:gap-2">
                                        <h2 className="text-base sm:text-xl font-bold text-earthy-900 font-display">Product Categories</h2>
                                        <span className="text-[11px] sm:text-sm text-earthy-500">Manage category visibility & status</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                        <div className="col-span-full border border-earthy-200 bg-earthy-50 p-2.5 sm:p-4 rounded-xl text-earthy-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium flex items-center gap-2">
                                            <Package size={14} className="sm:w-4 sm:h-4" /> These are the main categories displayed on the User Dashboard.
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
                                                    className={`bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all group relative cursor-pointer flex flex-col ${selectedCategory === cat.name ? 'ring-4 ring-offset-2 ring-organic-500' : ''}`}
                                                >
                                                    {/* Card Header with Dynamic Gradient */}
                                                    <div className={`h-28 sm:h-36 md:h-40 relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
                                                        {/* Abstract background shapes */}
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 translate-y-[-10px]" />
                                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-x-[-10px] translate-y-10" />

                                                        {/* Icons/Watermarks */}
                                                        <div className={`absolute right-2 bottom-2 md:right-4 md:bottom-4 ${iconColor} opacity-30 transform rotate-12 group-hover:scale-110 transition-transform duration-500`}>
                                                            <Package className="w-12 h-12 md:w-20 md:h-20" strokeWidth={1.5} />
                                                        </div>

                                                        {/* Content Overlay */}
                                                        <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between z-10">
                                                            <div className="flex justify-between items-start">
                                                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
                                                                    {cat.status}
                                                                </span>

                                                                {/* Edit Button - Floating */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditClick(cat);
                                                                    }}
                                                                    className="w-7 h-7 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-earthy-900 transition-all shadow-sm group-hover/btn"
                                                                >
                                                                    <Edit2 size={12} className="sm:w-4 sm:h-4" />
                                                                </button>
                                                            </div>

                                                            <h3 className="text-xs sm:text-xl md:text-2xl font-bold text-white font-display tracking-tight drop-shadow-md line-clamp-1">
                                                                {cat.name}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="p-3 sm:p-4 md:p-5 bg-white flex-1 flex flex-col justify-between">
                                                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-1">
                                                            <div className="bg-earthy-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center border border-earthy-100 group-hover:border-earthy-200 transition-colors">
                                                                <span className="text-earthy-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Stock</span>
                                                                <span className={`text-xs sm:text-sm font-bold ${cat.stock === 'High' ? 'text-green-600' : cat.stock === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                    {cat.stock}
                                                                </span>
                                                            </div>
                                                            <div className="bg-earthy-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center border border-earthy-100 group-hover:border-earthy-200 transition-colors">
                                                                <span className="text-earthy-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Items</span>
                                                                <span className="text-earthy-800 font-bold text-xs sm:text-lg">
                                                                    {products.filter(p => p.category === cat.name).length}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {selectedCategory === cat.name && (
                                                            <div className="mt-2.5 sm:mt-4 text-center text-[10px] sm:text-xs font-bold text-organic-600 bg-organic-50 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-organic-100 flex items-center justify-center gap-1.5 animate-pulse">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${glowColor}`} />
                                                                Filtering
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
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 sm:mb-4 gap-1 sm:gap-2">
                                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                            <h2 className="text-base sm:text-xl font-bold text-earthy-900 font-display">Inventory Items</h2>
                                            {selectedCategory !== 'All' && (
                                                <span className="bg-organic-100 text-organic-700 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5">
                                                    {selectedCategory}
                                                    <button onClick={() => setSelectedCategory('All')} className="hover:text-organic-900"><X size={12} /></button>
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] sm:text-sm text-earthy-500">Manage specific SKUs and products</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                        {products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).length === 0 ? (
                                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-earthy-400 bg-white rounded-2xl md:rounded-[2rem] border border-earthy-100 border-dashed">
                                                <Package size={48} className="mb-3 opacity-50" />
                                                <h3 className="text-base sm:text-xl font-bold text-earthy-600">No Items Found</h3>
                                                <p className="text-earthy-500 text-xs sm:text-sm mt-1">Start by adding a new item.</p>
                                            </div>
                                        ) : (
                                            products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((product) => (
                                                <div key={product.id} className="bg-white rounded-2xl md:rounded-[2rem] border border-earthy-100 overflow-hidden shadow-md hover:shadow-xl transition-all group relative flex flex-col">
                                                    {/* Product Card Content */}
                                                    <div className="h-32 sm:h-40 md:h-48 bg-earthy-200 relative overflow-hidden">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-organic-600/20 to-organic-900/20 mix-blend-multiply flex items-center justify-center text-earthy-400">
                                                                <Package size={32} />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-bold text-earthy-900 shadow-sm border border-earthy-100">
                                                            {product.category}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start mb-1 sm:mb-2 gap-1">
                                                            <h3 className="text-xs sm:text-base md:text-lg font-bold text-earthy-900 line-clamp-1">{product.name}</h3>
                                                            <span className="text-xs sm:text-base md:text-lg font-bold text-organic-600 shrink-0">₹{product.price}</span>
                                                        </div>
                                                        <p className="hidden sm:block text-xs md:text-sm text-earthy-500 line-clamp-2 mb-3 flex-1">{product.description || 'No description available.'}</p>

                                                        <div className="flex items-center justify-between mt-auto pt-2 md:pt-4 border-t border-earthy-100 text-[10px] sm:text-xs md:text-sm">
                                                            <span className={`font-medium flex items-center gap-1 ${product.stock > 10 ? 'text-green-600' :
                                                                product.stock > 0 ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                <Package size={12} className="sm:w-3.5 sm:h-3.5" />
                                                                <span className="truncate">{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</span>
                                                            </span>
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                <button
                                                                    onClick={() => handleProductEditClick(product)}
                                                                    className="p-1 sm:p-2 rounded-lg text-organic-600 hover:bg-organic-50 hover:text-organic-700 transition-colors"
                                                                    title="Edit Product"
                                                                >
                                                                    <Edit2 size={14} className="sm:w-4 sm:h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(product)}
                                                                    className="p-1 sm:p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                                    title="Delete Product"
                                                                >
                                                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
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
                                    className="bg-white rounded-[2rem] p-[clamp(1.5rem,4vw,2rem)] w-full max-w-md relative z-10 shadow-2xl"
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
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
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
                                    className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
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
                                    <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2.5 sm:pb-4 border-b border-earthy-100">
                                        <div>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-earthy-900">Add New Item</h3>
                                            <p className="text-earthy-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Fill in the details to add a new product to your catalog.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="p-1.5 sm:p-2 hover:bg-earthy-100 rounded-full transition-colors text-earthy-400 hover:text-earthy-600"
                                        >
                                            <X size={20} className="sm:w-6 sm:h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddProduct} className="space-y-3 sm:space-y-5 md:space-y-6">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Product Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                className="w-full px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-sm sm:text-base placeholder-earthy-300"
                                                placeholder="e.g. Premium Ragi Malt"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Category</label>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={newProduct.category}
                                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                        sx={{
                                                            height: { xs: '42px', sm: '52px' },
                                                            borderRadius: { xs: '0.75rem', sm: '1rem' },
                                                            backgroundColor: 'rgba(255, 247, 237, 0.5)',
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e5e7eb"
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#65a30d"
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#65a30d"
                                                            },
                                                            fontSize: { xs: '0.875rem', sm: '1rem' }
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
                                                <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-sm sm:text-base placeholder-earthy-300"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-sm sm:text-base placeholder-earthy-300"
                                                    placeholder="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Product Image (Cloudinary)</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="new-product-file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e, 'new')}
                                                        disabled={uploadingImage}
                                                    />
                                                    {newProduct.image_url ? (
                                                        <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-earthy-50 rounded-xl sm:rounded-2xl border border-earthy-200">
                                                            <img src={newProduct.image_url} alt="Preview" className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-earthy-800 truncate">Image uploaded</p>
                                                                <p className="text-[10px] text-emerald-600 font-medium">Ready in Cloudinary</p>
                                                            </div>
                                                            <label
                                                                htmlFor="new-product-file"
                                                                className="px-2 py-1 bg-white border border-earthy-200 rounded-lg text-xs font-bold text-earthy-600 hover:bg-earthy-100 cursor-pointer"
                                                            >
                                                                Change
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <label
                                                            htmlFor="new-product-file"
                                                            className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-earthy-200 hover:border-organic-500 bg-earthy-50/50 hover:bg-white transition-all cursor-pointer text-xs sm:text-sm font-bold text-earthy-600 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {uploadingImage ? (
                                                                <>
                                                                    <Loader2 size={16} className="animate-spin text-organic-600" />
                                                                    <span>Uploading...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UploadCloud size={16} className="text-organic-600" />
                                                                    <span>Upload from Device</span>
                                                                </>
                                                            )}
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-bold text-earthy-700 mb-1 sm:mb-2 ml-0.5 sm:ml-1">Description</label>
                                            <textarea
                                                rows="2"
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                className="w-full px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-earthy-200 focus:outline-none focus:ring-2 focus:ring-organic-500 bg-earthy-50/50 hover:bg-white transition-all shadow-sm focus:shadow-md text-sm sm:text-base resize-none placeholder-earthy-300"
                                                placeholder="Product details, benefits, ingredients..."
                                            />
                                        </div>

                                        <div className="pt-3 sm:pt-6 md:pt-8 flex gap-2 sm:gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                className="flex-1 py-2.5 sm:py-4 rounded-xl font-bold text-earthy-600 hover:bg-earthy-50 hover:text-earthy-800 transition-all border border-transparent hover:border-earthy-200 text-sm sm:text-base md:text-lg"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-2.5 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-organic-600 to-organic-500 hover:from-organic-700 hover:to-organic-600 transition-all shadow-lg shadow-organic-600/30 hover:shadow-organic-600/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg"
                                            >
                                                <Check size={18} className="sm:w-5 sm:h-5" /> Add Item
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isEditProductModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
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
                                    className="bg-white rounded-2xl sm:rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
                                >
                                    {/* Header with Pattern */}
                                    <div className="relative bg-[#14261C] p-4 sm:p-8 md:p-10 text-white overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-110 mix-blend-overlay pointer-events-none" />
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-organic-500 rounded-full blur-[120px] opacity-20 translate-x-[20%] translate-y-[-40%]" />
                                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500 rounded-full blur-[100px] opacity-10 translate-x-[-20%] translate-y-[20%]" />

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-1 sm:mb-2">Edit Inventory Item</h3>
                                                <div className="flex items-center gap-2 sm:gap-3 text-white/60">
                                                    <span className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide border border-white/10 uppercase">ID: {productToEdit?.id}</span>
                                                    <span className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide border border-white/10 uppercase">Last Updated: Just now</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsEditProductModalOpen(false)}
                                                className="p-1.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80 hover:text-white backdrop-blur-sm"
                                            >
                                                <X size={18} className="sm:w-6 sm:h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="p-4 sm:p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF9F6]">
                                        <form onSubmit={handleEditProductSubmit} className="space-y-4 sm:space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                                <div className="group">
                                                    <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Product Name</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-earthy-400 group-focus-within:text-organic-600 transition-colors">
                                                            <Package size={16} className="sm:w-5 sm:h-5" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={editProductForm.name}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                                                            className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-sm sm:text-base text-earthy-800 placeholder-earthy-300"
                                                            placeholder="Enter product name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Category</label>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={editProductForm.category}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                                                            displayEmpty
                                                            sx={{
                                                                borderRadius: { xs: '0.75rem', sm: '1rem' },
                                                                backgroundColor: 'white',
                                                                fontFamily: 'inherit',
                                                                fontWeight: 500,
                                                                color: '#4b5563',
                                                                "& fieldset": { borderWidth: '2px', borderColor: '#e5e7eb' },
                                                                "&:hover fieldset": { borderColor: '#a3e635 !important' },
                                                                "&.Mui-focused fieldset": { borderColor: '#65a30d !important', borderWidth: '2px !important' },
                                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                                            }}
                                                        >
                                                            {categories.map(cat => (
                                                                <MenuItem key={cat.id} value={cat.name} sx={{ borderRadius: '0.75rem', margin: '4px', "&:hover": { backgroundColor: '#ecfccb', color: '#365314' } }}>{cat.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                                <div className="group">
                                                    <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Price details</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-earthy-400 font-bold group-focus-within:text-organic-600 transition-colors text-sm sm:text-base">₹</div>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            value={editProductForm.price}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                                                            className="w-full pl-8 sm:pl-10 pr-4 sm:pr-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-bold text-sm sm:text-lg text-earthy-900 placeholder-earthy-300"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div className="group">
                                                        <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Stock</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={editProductForm.stock}
                                                            onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                                                            className="w-full px-3.5 py-2.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-sm sm:text-base text-earthy-800 placeholder-earthy-300"
                                                            placeholder="100"
                                                        />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Product Image (Cloudinary)</label>
                                                        <input
                                                            type="file"
                                                            id="edit-product-file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(e, 'edit')}
                                                            disabled={uploadingImage}
                                                        />
                                                        {editProductForm.image_url ? (
                                                            <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded-xl sm:rounded-2xl border-2 border-earthy-100">
                                                                <img src={editProductForm.image_url} alt="Preview" className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-earthy-800 truncate">Image selected</p>
                                                                    <p className="text-[10px] text-emerald-600 font-medium truncate">Cloudinary URL</p>
                                                                </div>
                                                                <label
                                                                    htmlFor="edit-product-file"
                                                                    className="px-2 py-1 bg-earthy-100 rounded-lg text-xs font-bold text-earthy-700 hover:bg-earthy-200 cursor-pointer"
                                                                >
                                                                    Change
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="edit-product-file"
                                                                className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-earthy-200 hover:border-organic-500 bg-white transition-all cursor-pointer text-xs sm:text-sm font-bold text-earthy-600 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {uploadingImage ? (
                                                                    <>
                                                                        <Loader2 size={16} className="animate-spin text-organic-600" />
                                                                        <span>Uploading...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UploadCloud size={16} className="text-organic-600" />
                                                                        <span>Upload from Device</span>
                                                                    </>
                                                                )}
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[11px] sm:text-xs font-bold text-earthy-500 mb-1 sm:mb-2 ml-1 uppercase tracking-wider">Description</label>
                                                <textarea
                                                    rows="3"
                                                    value={editProductForm.description}
                                                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-earthy-100 bg-white focus:outline-none focus:border-organic-500 focus:ring-4 focus:ring-organic-100 transition-all font-medium text-sm sm:text-base text-earthy-800 resize-none placeholder-earthy-300 leading-relaxed"
                                                    placeholder="Describe the product features, benefits, and ingredients..."
                                                />
                                            </div>

                                            <div className="pt-4 sm:pt-8 flex gap-2 sm:gap-4 border-t border-earthy-200">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditProductModalOpen(false)}
                                                    className="px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl font-bold text-earthy-600 hover:bg-earthy-100 hover:text-earthy-900 transition-all text-sm sm:text-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-2.5 sm:py-4 rounded-xl font-bold text-white bg-[#14261C] hover:bg-[#1f3a2b] transition-all shadow-lg shadow-[#14261C]/20 hover:shadow-[#14261C]/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg"
                                                >
                                                    <span>Update Inventory</span>
                                                    <div className="bg-white/20 p-1 rounded-full">
                                                        <Check size={14} className="sm:w-4 sm:h-4" />
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
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsOrderDetailsModalOpen(false)}
                                    className="absolute inset-0 bg-earthy-900/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    className="bg-white rounded-2xl sm:rounded-[2rem] w-full max-w-4xl max-h-[92vh] overflow-hidden relative z-10 shadow-2xl flex flex-col min-w-0"
                                >
                                    {/* Modal Header */}
                                    <div className="px-4 py-3 sm:px-8 sm:py-5 border-b border-earthy-100 bg-gradient-to-r from-earthy-50/80 to-white sticky top-0 z-20">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                                                <h2 className="text-base sm:text-2xl font-bold font-display text-earthy-900">Order Details</h2>
                                                <span className="bg-organic-50 text-organic-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold border border-organic-100 flex items-center gap-1 shadow-sm shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-organic-500"></span>
                                                    #{selectedOrderDetails.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => setIsOrderDetailsModalOpen(false)}
                                                    className="bg-earthy-100/80 p-1.5 sm:p-2 rounded-full hover:bg-earthy-200 transition-colors border border-earthy-200 text-earthy-600 hover:text-earthy-900"
                                                    title="Close"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-earthy-100/60 sm:border-0 sm:pt-0">
                                            <p className="text-earthy-500 text-[11px] sm:text-sm flex items-center gap-1.5">
                                                <span>Placed:</span>
                                                <span className="font-semibold text-earthy-700 bg-white/70 px-1.5 py-0.5 rounded border border-earthy-100">
                                                    {new Date(selectedOrderDetails.created_at).toLocaleDateString()} {new Date(selectedOrderDetails.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <button
                                                    onClick={handleDownloadPDF}
                                                    disabled={isPdfDownloading}
                                                    className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 bg-organic-700 hover:bg-organic-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                                    title="Download PDF Invoice"
                                                >
                                                    <Download size={13} />
                                                    <span>{isPdfDownloading ? 'Saving...' : 'Download PDF'}</span>
                                                </button>
                                                <button
                                                    onClick={handlePrintInvoice}
                                                    className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 bg-white border border-earthy-200 rounded-lg text-xs font-bold text-earthy-700 hover:bg-earthy-50 transition-colors shadow-sm active:scale-95"
                                                    title="Print Invoice"
                                                >
                                                    <Printer size={13} />
                                                    <span className="hidden sm:inline">Print</span>
                                                </button>
                                                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold border flex items-center gap-1 shadow-sm
                                                    ${selectedOrderDetails.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        selectedOrderDetails.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            selectedOrderDetails.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {selectedOrderDetails.status === 'Delivered' ? <Check size={12} /> :
                                                        selectedOrderDetails.status === 'Cancelled' ? <X size={12} /> :
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                                    {selectedOrderDetails.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Content - Scrollable */}
                                    <div className="p-3.5 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-white to-earthy-50/30 space-y-4 sm:space-y-6 min-w-0">

                                        {/* Info Cards Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 min-w-0">
                                            {(() => {
                                                const parsed = parseInvoiceShippingInfo(selectedOrderDetails);
                                                return [
                                                    {
                                                        icon: User, title: 'Customer', content: (
                                                            <>
                                                                <p className="font-bold text-earthy-900 text-sm sm:text-base mb-0.5 truncate">{parsed.name}</p>
                                                                <p className="text-earthy-500 text-xs truncate">{parsed.email}</p>
                                                                <p className="text-earthy-500 text-xs flex items-center gap-1.5 mt-1.5">
                                                                    <span className="w-5 h-5 rounded-full bg-earthy-100 flex items-center justify-center text-earthy-500 shrink-0"><Phone size={10} /></span>
                                                                    <span className="truncate">{parsed.phone}</span>
                                                                </p>
                                                            </>
                                                        )
                                                    },
                                                    {
                                                        icon: DollarSign, title: 'Payment', content: (
                                                            <>
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-earthy-500 text-xs">Method</span>
                                                                    <span className="font-bold text-earthy-800 bg-white px-2 py-0.5 rounded border border-earthy-100 text-xs uppercase">{selectedOrderDetails.payment_method || 'Online'}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-earthy-100/60">
                                                                    <span className="text-earthy-500 text-xs font-medium">Total Paid</span>
                                                                    <span className="font-bold text-organic-700 text-base sm:text-lg font-display">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                                </div>
                                                            </>
                                                        )
                                                    },
                                                    {
                                                        icon: Package, title: 'Shipping', content: (
                                                            <div className="text-xs text-earthy-700 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-earthy-100/60 break-words space-y-0.5">
                                                                <p className="font-bold text-earthy-900 truncate">{parsed.name}</p>
                                                                <p className="text-earthy-600">{parsed.address}</p>
                                                                {parsed.pincode && <p className="text-earthy-500 font-semibold">PIN: {parsed.pincode}</p>}
                                                                {parsed.phone !== 'N/A' && <p className="text-earthy-400 text-[11px]">📞 {parsed.phone}</p>}
                                                            </div>
                                                        )
                                                    }
                                                ];
                                            })().map((card, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-white to-earthy-50/50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-earthy-100 shadow-sm relative overflow-hidden min-w-0">
                                                    <div className="flex items-center gap-2.5 mb-3 relative">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-organic-500 to-organic-600 text-white flex items-center justify-center shadow-md shrink-0">
                                                            <card.icon size={16} />
                                                        </div>
                                                        <h4 className="font-bold text-earthy-400 uppercase tracking-widest text-[10px] sm:text-xs">{card.title}</h4>
                                                    </div>
                                                    <div className="relative z-10">
                                                        {card.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Items Section */}
                                        <div className="bg-white rounded-xl sm:rounded-2xl border border-earthy-100 shadow-sm overflow-hidden flex flex-col min-w-0">
                                            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-earthy-50/50 to-white border-b border-earthy-100 flex justify-between items-center">
                                                <h3 className="font-bold text-earthy-900 flex items-center gap-2 text-xs sm:text-base">
                                                    Order Items
                                                    <span className="px-2 py-0.5 rounded-full bg-organic-100 text-organic-700 text-[10px] sm:text-xs font-bold border border-organic-200">
                                                        {selectedOrderDetails.items ? selectedOrderDetails.items.length : 0}
                                                    </span>
                                                </h3>
                                            </div>

                                            <div>
                                                {selectedOrderDetails.isLoading ? (
                                                    <div className="flex justify-center p-8">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-600"></div>
                                                    </div>
                                                ) : selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                                                    <div className="divide-y divide-earthy-50">
                                                        {selectedOrderDetails.items.map((item, idx) => (
                                                            <div key={idx} className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-earthy-50/30 transition-colors">
                                                                <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-earthy-50 to-earthy-100 flex items-center justify-center text-earthy-400 border border-earthy-100 shrink-0">
                                                                    <Leaf size={20} />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-earthy-900 text-xs sm:text-base truncate">{item.product_name}</h4>
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-earthy-500 mt-0.5">
                                                                        <span className="font-mono text-[10px] bg-earthy-50 px-1.5 py-0.5 rounded border border-earthy-100">Qty: {item.quantity}</span>
                                                                        <span>₹{parseFloat(item.price).toFixed(2)} each</span>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right shrink-0">
                                                                    <span className="block font-bold text-earthy-900 text-xs sm:text-base font-display">₹{(item.quantity * item.price).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-8">
                                                        <p className="text-earthy-400 text-xs">No items found for this order.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Summary Footer */}
                                            <div className="bg-gradient-to-b from-white to-earthy-50/50 p-3.5 sm:p-6 border-t border-earthy-100">
                                                <div className="flex flex-col gap-2 w-full sm:max-w-xs ml-auto bg-white p-3.5 sm:p-4 rounded-xl border border-earthy-100 shadow-sm">
                                                    <div className="flex justify-between text-earthy-500 text-xs">
                                                        <span>Subtotal</span>
                                                        <span>₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-earthy-500 text-xs">
                                                        <span>Shipping</span>
                                                        <span className="text-emerald-600 font-bold">Free</span>
                                                    </div>
                                                    <div className="w-full h-px border-t border-dashed border-earthy-200 my-0.5"></div>
                                                    <div className="flex justify-between text-earthy-900 items-end">
                                                        <span className="font-bold text-xs">Total Amount</span>
                                                        <span className="text-organic-700 text-lg sm:text-2xl font-bold font-display">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
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
