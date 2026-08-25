import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const OrganicAtta = () => {
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/products');
                const filtered = res.data
                    .filter(p => p.category === 'Organic Atta')
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        rating: p.rating || 4.8,
                        image: p.image_url || '/placeholder-atta.jpg',
                        isDynamic: true
                    }));
                setProducts(filtered);
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
        <div className="min-h-screen pt-24 md:pt-32 pb-6 md:pb-20 px-4 sm:px-8 lg:px-12 bg-[#FAF9F6] relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -z-10 translate-y-[-20%] translate-x-[10%] w-[600px] h-[600px] bg-organic-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 translate-y-[20%] translate-x-[-10%] w-[500px] h-[500px] bg-earthy-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto z-10 relative">
                {/* Header */}
                <div className="mb-6 md:mb-12">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-earthy-500 hover:text-organic-700 font-bold mb-3 md:mb-6 transition-colors text-sm md:text-base">
                        <ArrowLeft size={18} className="md:w-5 md:h-5" /> Back
                    </button>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl md:text-5xl font-display font-bold text-earthy-900 mb-2 md:mb-4 flex flex-wrap items-center gap-2 md:gap-4">
                            Organic Atta
                            <span className="bg-organic-100 text-organic-700 px-2.5 py-0.5 md:px-4 md:py-1 rounded-full text-xs md:text-lg font-bold tracking-wide whitespace-nowrap">{allProducts.length} Items</span>
                        </h1>
                        <p className="text-earthy-600 text-sm md:text-lg max-w-2xl">
                            Wholesome, stone-ground flours made from the finest organic grains and vegetables.
                        </p>
                    </motion.div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {allProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[1.2rem] md:rounded-[2.5rem] p-2 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-organic-100"
                        >
                            <div className="relative h-32 md:h-64 rounded-[1rem] md:rounded-[2rem] overflow-hidden mb-2 md:mb-6 bg-earthy-50 group-hover:scale-[1.02] transition-transform duration-500">
                                <Link to={`/product/${product.id}`} className="block w-full h-full">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product);
                                    }}
                                    className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-10 md:h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm z-10"
                                >
                                    <Heart size={12} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={`md:w-5 md:h-5 ${isInWishlist(product.id) ? "text-red-500" : ""}`} />
                                </button>
                                {/* Mobile Rating Overlay */}
                                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded-md flex items-center gap-0.5 md:hidden shadow-sm">
                                    <Star size={8} className="text-yellow-500" fill="currentColor" />
                                    <span className="text-[9px] font-bold text-earthy-900">{product.rating}</span>
                                </div>
                            </div>

                            <div className="px-1 md:px-2">
                                <Link to={`/product/${product.id}`} className="block mb-1 md:mb-2">
                                    <h3 className="text-xs md:text-2xl font-bold text-earthy-900 leading-tight hover:text-organic-700 transition-colors line-clamp-2 min-h-[2.5em] md:min-h-0">{product.name}</h3>
                                </Link>

                                <div className="hidden md:flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg w-fit mb-2">
                                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                                    <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
                                </div>

                                <p className="hidden md:block text-earthy-500 text-sm font-medium mb-6 line-clamp-2 min-h-[40px] leading-relaxed">{product.description}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="text-[8px] md:text-xs font-bold text-earthy-400 uppercase tracking-wider md:mb-1">Price</p>
                                        <p className="text-base md:text-2xl font-black text-organic-700">₹{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            showToast(`${product.name} added to cart!`);
                                        }}
                                        className="bg-[#1A2E16] text-white px-2 py-1 md:px-6 md:py-3 rounded-lg md:rounded-2xl flex items-center gap-1 md:gap-2 font-bold hover:bg-[#2F4F2C] transition-colors shadow-lg active:scale-95 text-[10px] md:text-base"
                                    >
                                        <ShoppingCart size={14} className="md:w-[18px] md:h-[18px]" />
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

export default OrganicAtta;
