export const getOptimizedImageUrl = (url, width = 400) => {
    if (!url || typeof url !== 'string') {
        return url;
    }

    const imageUrl = url.trim();

    if (!imageUrl.includes('cloudinary.com')) {
        return imageUrl; // Return original if not Cloudinary
    }

    const secureUrl = imageUrl.replace(/^http:\/\//i, 'https://');

    // Example Cloudinary URL: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
    // We want to insert transformations after /upload/
    const uploadIndex = secureUrl.indexOf('/upload/');
    if (uploadIndex === -1) return secureUrl;

    const base = secureUrl.substring(0, uploadIndex + 8); // includes '/upload/'
    const rest = secureUrl.substring(uploadIndex + 8);

    // If it already has transformations (like /c_scale,w_400/), don't add more unless we want to replace them
    // For simplicity, just check if there's already a /v or /something/ before the actual filename
    // Actually, checking if there's a '/' before the next part is enough to see if transformations exist, but Cloudinary versions start with 'v' and numbers.
    // A safe way is to just inject `/q_auto,f_auto,w_${width}/` right after `/upload/`
    
    return `${base}q_auto,f_auto,w_${width}/${rest}`;
};
