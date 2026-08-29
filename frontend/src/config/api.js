/**
 * Centralized API Configuration
 * Automatically uses VITE_API_URL in production (Render) or localhost:5001 in development.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
export const API_URL = `${API_BASE_URL}/api`;

export default API_URL;
