import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const isAdminUser = (user) => {
    const email = user?.email?.trim().toLowerCase();
    return email === 'admin@purazya.com' || email === 'admin@gmail.com';
};

const ProtectedRoute = ({ children, requiredRole }) => {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole === 'admin' && !isAdminUser(user)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
