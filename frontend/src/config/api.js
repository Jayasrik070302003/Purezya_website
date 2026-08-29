/**
 * Centralized API Configuration
 * Automatically uses VITE_API_URL in production (Render) or localhost:5001 in development.
 * Guarantees proper https:// and public domain resolution.
 */

const getApiBaseUrl = () => {
    let rawUrl = import.meta.env.VITE_API_URL;
    
    // Fallback if VITE_API_URL is unset
    if (!rawUrl || rawUrl.trim() === '' || rawUrl === 'undefined' || rawUrl === 'null') {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return 'https://purazya-backend.onrender.com';
        }
        return 'http://localhost:5001';
    }

    let url = rawUrl.trim().replace(/\/+$/, '');

    // If Render passed internal service name like 'purazya-backend' or 'purezya-backend' without a domain
    if (!url.includes('.') && !url.includes('localhost')) {
        url = `${url}.onrender.com`;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    return url;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

export default API_URL;
