export const productFallbackImages = {
    malt: '/asset/malt-beverage.jpg',
    atta: '/Product iamges/wheat-atta.jpg',
    snacks: '/asset/snacks-sweets.jpg',
    noodles: '/Product iamges/palak-noodles-premium-v2.jpg',
    wellness: '/asset/wellness-products.jpg',
    generic: '/asset/hero-products.jpg'
};

export const handleProductImageError = (fallback = productFallbackImages.generic) => (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
};
