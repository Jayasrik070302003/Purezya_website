/**
 * Centralized API Configuration
 * Automatically uses VITE_API_URL in production (Render) or localhost:5001 in development.
 * Guarantees proper https:// protocol prefix if host string is injected by cloud providers.
 */

const getApiBaseUrl = () => {
    const rawUrl = import.meta.env.VITE_API_URL;
    if (!rawUrl || rawUrl.trim() === '') {
        return 'http://localhost:5001';
    }

    let url = rawUrl.trim().replace(/\/+$/, '');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    return url;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

export default API_URL;
