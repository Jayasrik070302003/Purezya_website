import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (e) {
                        console.error('Failed to parse saved user:', e);
                    }
                }
                // Fetch fresh profile from DB including phone
                try {
                    const res = await axios.get(`${API_URL}/auth/me`);
                    if (res.data) {
                        setUser(res.data);
                        localStorage.setItem('user', JSON.stringify(res.data));
                    }
                } catch (err) {
                    console.warn('Could not refresh profile from server:', err);
                }
            } else {
                delete axios.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateUser = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
