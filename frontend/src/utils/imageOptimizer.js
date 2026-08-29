export const getOptimizedImageUrl = (url, width = 400) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url; // Return original if not Cloudinary
    }

    // Example Cloudinary URL: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
    // We want to insert transformations after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const base = url.substring(0, uploadIndex + 8); // includes '/upload/'
    const rest = url.substring(uploadIndex + 8);

    // If it already has transformations (like /c_scale,w_400/), don't add more unless we want to replace them
    // For simplicity, just check if there's already a /v or /something/ before the actual filename
    // Actually, checking if there's a '/' before the next part is enough to see if transformations exist, but Cloudinary versions start with 'v' and numbers.
    // A safe way is to just inject `/q_auto,f_auto,w_${width}/` right after `/upload/`
    
    return `${base}q_auto,f_auto,w_${width}/${rest}`;
};
