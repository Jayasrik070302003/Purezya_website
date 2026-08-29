import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Catalogue from './pages/Catalogue';
import { ToastProvider } from './context/ToastContext';
import { ShopProvider } from './context/ShopContext';
import MaltBeverages from './pages/MaltBeverages';
import OrganicAtta from './pages/OrganicAtta';
import SnacksAndSweets from './pages/SnacksAndSweets';
import NoodlesAndPasta from './pages/NoodlesAndPasta';
import WellnessProducts from './pages/WellnessProducts';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import axios from 'axios';
import { API_URL } from './config/api';

// Ensure fresh data on every request
axios.interceptors.request.use(config => {
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';
  // Add timestamp to query to force browser to treat as new request
  config.params = { ...config.params, _t: Date.now() };
  console.log(`[API] ${config.method.toUpperCase()} request to ${config.url}`);
  return config;
});

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/admin'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => {
    // Ping backend on route change to ensure freshness/connectivity
    const logNavigation = async () => {
      try {
        await axios.get(`${API_URL}/products?ping=true&limit=1`);
      } catch (e) {
        // Silent catch for initial render
      }
    };
    logNavigation();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-earthy-50">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Routes (Accessible by all visitors freely) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/malt-beverages" element={<MaltBeverages />} />
        <Route path="/organic-atta" element={<OrganicAtta />} />
        <Route path="/snacks-sweets" element={<SnacksAndSweets />} />
        <Route path="/noodles-pasta" element={<NoodlesAndPasta />} />
        <Route path="/wellness-products" element={<WellnessProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected Routes (Requires Login) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ShopProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </ShopProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
