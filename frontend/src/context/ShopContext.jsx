import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const item = localStorage.getItem('purezya_cart');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const item = localStorage.getItem('purezya_wishlist');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            return [];
        }
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('purezya_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('purezya_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product, qty = 1) => {
        // Sanitize product object to remove React components/JSX before storing
        // This prevents JSON.stringify errors and state bloat
        const safeProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.image_url,
            description: typeof product.description === 'string' ? product.description : '',
            quantity: qty
        };

        setCart(prev => {
            const existing = prev.find(item => item.id === safeProduct.id);
            if (existing) {
                return prev.map(item => item.id === safeProduct.id ? { ...item, quantity: item.quantity + qty } : item);
            }
            return [...prev, safeProduct];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleWishlist = (product) => {
        const safeProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.image_url,
            description: typeof product.description === 'string' ? product.description : ''
        };

        setWishlist(prev => {
            const exists = prev.find(item => item.id === safeProduct.id);
            if (exists) {
                return prev.filter(item => item.id !== safeProduct.id);
            }
            return [...prev, safeProduct];
        });
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    const createOrder = async (orderData) => {
        try {
            const response = await axios.post('http://localhost:5001/api/orders', orderData);
            return response.data;
        } catch (error) {
            console.error("Order creation failed:", error);
            throw error;
        }
    };

    return (
        <ShopContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, clearCart, toggleWishlist, isInWishlist, createOrder }}>
            {children}
        </ShopContext.Provider>
    );
};
