import { API_BASE_URL } from '../config/api';

export const normalizeImagePath = (src) => {
    if (!src || typeof src !== 'string') return '';
    const trimmed = src.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
        return getOptimizedImageUrl(trimmed);
    }

    if (trimmed.startsWith('/uploads/')) {
        return `${API_BASE_URL}${trimmed}`;
    }

    return trimmed;
};

export const getOptimizedImageUrl = (url, width = 400) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    let imageUrl = url.trim();
    if (!imageUrl) return '';

    // 1. Handle local backend upload paths
    if (imageUrl.startsWith('/uploads/')) {
        return `${API_BASE_URL}${imageUrl}`;
    }

    // 2. Replace any legacy localhost / 127.0.0.1 backend URLs with public backend
    imageUrl = imageUrl.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/uploads\/.*)$/i, `${API_BASE_URL}$3`);

    // 3. Ensure HTTPS protocol for all external URLs
    if (imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
    } else if (imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace(/^http:\/\//i, 'https://');
    }

    // 4. Non-Cloudinary URLs (Local public assets, Unsplash, etc.)
    if (!imageUrl.includes('cloudinary.com')) {
        return imageUrl;
    }

    // 5. Cloudinary optimization
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex === -1) return imageUrl;

    const prefix = imageUrl.substring(0, uploadIndex + 8);
    let rest = imageUrl.substring(uploadIndex + 8);

    rest = rest.replace(/^(?:(?:[a-z]_[a-z0-9_.-]+,?)+|\b(?:q_auto|f_auto|w_\d+|c_\w+)\b,?)\//gi, '');
    rest = rest.replace(/^\/+/, '');

    const transform = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';
    return `${prefix}${transform}/${rest}`;
};
