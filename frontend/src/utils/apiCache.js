import axios from 'axios';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchWithCache = async (url) => {
    const now = Date.now();
    
    if (cache.has(url)) {
        const cached = cache.get(url);
        if (now - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        } else {
            cache.delete(url);
        }
    }

    try {
        const res = await axios.get(url);
        cache.set(url, {
            timestamp: now,
            data: res.data
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const clearCache = (url) => {
    if (url) {
        cache.delete(url);
    } else {
        cache.clear();
    }
};
