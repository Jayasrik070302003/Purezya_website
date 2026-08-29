/**
 * Centralized API Configuration
 * Automatically uses VITE_API_URL in production (Render) or localhost:5001 in development.
 * Guarantees proper https:// and .onrender.com domain resolution.
 */

const getApiBaseUrl = () => {
    const rawUrl = import.meta.env.VITE_API_URL;
    if (!rawUrl || rawUrl.trim() === '') {
        return 'http://localhost:5001';
    }

    let url = rawUrl.trim().replace(/\/+$/, '');

    // If a raw service name was injected (e.g. 'purazya-backend' or 'purezya-backend') without a dot/TLD
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
