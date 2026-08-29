import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Leaf, Star, Info, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { handleProductImageError, productFallbackImages } from '../utils/productImages';
import { API_URL } from '../config/api';

const MaltBeverages = () => {
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchWithCache(`${API_URL}/products?category=Malt%20Beverages`);
                // Map to match frontend structure
                const mapped = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        rating: p.rating || 4.8, // Default rating
                        image: getOptimizedImageUrl(p.image_url, 400) || productFallbackImages.malt,
                        isDynamic: true
                    }));
                setProducts(mapped);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const allProducts = products;

    return (
        <div className="min-h-screen pt-[clamp(6rem,12vw,8rem)] pb-[clamp(1.5rem,5vw,5rem)] px-[clamp(1rem,4vw,3rem)] bg-[#FAF9F6] relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[500px] h-[500px] bg-earthy-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto z-10 relative">
                {/* Header */}
                <div className="mb-fluid-xl">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-fluid-xs text-earthy-500 hover:text-organic-700 font-bold mb-[clamp(0.75rem,2vw,1.5rem)] transition-colors text-fluid-base">
                        <ArrowLeft className="w-[clamp(1.125rem,1.5vw,1.25rem)] h-[clamp(1.125rem,1.5vw,1.25rem)]" /> Back
                    </button>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-display font-bold text-earthy-900 mb-fluid-sm flex flex-wrap items-center gap-fluid-sm">
                            Malt Beverages
                            <span className="bg-organic-100 text-organic-700 px-[clamp(0.625rem,1.5vw,1rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] rounded-full text-fluid-sm font-bold tracking-wide whitespace-nowrap">{allProducts.length} Items</span>
                        </h1>
                        <p className="text-earthy-600 text-fluid-base max-w-2xl">
                            Energize your day with our premium collection of handcrafted organic malts. Pure nutrition in every sip.
                        </p>
                    </motion.div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5 sm:gap-4 md:gap-fluid-md">
                    {allProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-fluid-2xl p-2 sm:p-3 md:p-[clamp(0.5rem,2vw,1.5rem)] shadow-xl hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-organic-100 flex flex-col min-w-0"
                        >
                            <div className="relative aspect-square md:aspect-auto md:h-[clamp(12rem,25vw,16rem)] rounded-fluid-xl overflow-hidden mb-[clamp(0.5rem,2vw,1.5rem)] bg-earthy-50 group-hover:scale-[1.02] transition-transform duration-500">
                                <Link to={`/product/${product.id}`} className="block w-full h-full">
                                    <img
                                        src={product.image}
                                        alt=""
                                        loading="lazy"
                                        onError={handleProductImageError(productFallbackImages.malt)}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product);
                                    }}
                                    className="absolute top-[clamp(0.5rem,1.5vw,1rem)] right-[clamp(0.5rem,1.5vw,1rem)] w-[clamp(1.5rem,3vw,2.5rem)] h-[clamp(1.5rem,3vw,2.5rem)] bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm z-10"
                                >
                                    <Heart className={`w-[clamp(0.75rem,1.5vw,1.25rem)] h-[clamp(0.75rem,1.5vw,1.25rem)] ${isInWishlist(product.id) ? "text-red-500" : ""}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute top-[clamp(0.5rem,1.5vw,1rem)] left-[clamp(0.5rem,1.5vw,1rem)] px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-organic-600/90 backdrop-blur text-white text-[clamp(0.5625rem,1vw,0.75rem)] font-bold rounded-full uppercase tracking-widest pointer-events-none">
                                        Best Seller
                                    </div>
                                )}
                                {/* Mobile Rating Overlay */}
                                <div className="absolute bottom-[clamp(0.375rem,1vw,0.75rem)] left-[clamp(0.375rem,1vw,0.75rem)] px-[clamp(0.375rem,1vw,0.5rem)] py-[clamp(0.125rem,0.5vw,0.25rem)] bg-white/90 backdrop-blur rounded-md flex items-center gap-0.5 md:hidden shadow-sm">
                                    <Star className="text-yellow-500 w-[clamp(0.5rem,1vw,0.75rem)] h-[clamp(0.5rem,1vw,0.75rem)]" fill="currentColor" />
                                    <span className="text-[clamp(0.5625rem,1vw,0.75rem)] font-bold text-earthy-900">{product.rating}</span>
                                </div>
                            </div>

                            <div className="px-[clamp(0.25rem,1vw,0.5rem)] flex flex-col flex-1">
                                <Link to={`/product/${product.id}`} className="block mb-1 md:mb-2">
                                    <h3 className="text-[clamp(0.75rem,2vw,1.5rem)] font-bold text-earthy-900 leading-tight hover:text-organic-700 transition-colors line-clamp-2 min-h-[2.5em] md:min-h-0">{product.name}</h3>
                                </Link>

                                <div className="hidden md:flex items-center gap-1 bg-yellow-50 px-fluid-sm py-fluid-xs rounded-lg w-fit mb-2">
                                    <Star className="text-yellow-500 w-[clamp(0.75rem,1vw,0.875rem)] h-[clamp(0.75rem,1vw,0.875rem)]" fill="currentColor" />
                                    <span className="text-fluid-xs font-bold text-yellow-700">{product.rating}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <div>
                                        <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-bold text-earthy-400 uppercase tracking-wider md:mb-1">Price</p>
                                        <p className="text-[clamp(1rem,2.5vw,1.5rem)] font-black text-organic-700">₹{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            showToast(`${product.name} added to cart!`);
                                        }}
                                        className="bg-[#1A2E16] text-white px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.25rem,1vw,0.75rem)] rounded-fluid-lg flex items-center gap-[clamp(0.25rem,1vw,0.5rem)] font-bold hover:bg-[#2F4F2C] transition-colors shadow-lg active:scale-95 text-[clamp(0.625rem,1.5vw,1rem)]"
                                    >
                                        <ShoppingCart className="w-[clamp(0.875rem,1.5vw,1.125rem)] h-[clamp(0.875rem,1.5vw,1.125rem)]" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaltBeverages;
