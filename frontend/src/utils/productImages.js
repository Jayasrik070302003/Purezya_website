export const productFallbackImages = {
    malt: '/malt-beverage.jpg',
    atta: '/wheat-atta.jpg',
    snacks: '/snacks-sweets.jpg',
    noodles: '/beetroot-noodles.jpg',
    wellness: '/amla-gulkand-premium.png',
    generic: '/hero-products.jpg'
};

export const handleProductImageError = (fallback = productFallbackImages.generic) => (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
};
