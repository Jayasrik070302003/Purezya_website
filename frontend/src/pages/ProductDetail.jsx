import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, ShoppingCart, Heart, ArrowLeft, Leaf, Shield, Check,
    Flame, Activity, Users, Droplets, ArrowRight, Minus, Plus
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { fetchWithCache } from '../utils/apiCache';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { API_URL } from '../config/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useShop();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [dynamicProduct, setDynamicProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extended Product Data (Mocking a database fetch)
    const productDatabase = {
        'm1': {
            id: 'm1',
            name: 'Beetroot Malt',
            description: 'A powerhouse of iron and antioxidants. Our Beetroot Malt is crafted from premium organic beetroots, roasted to perfection to retain essential nutrients. It naturally boosts immunity and improves hemoglobin levels.',
            price: 450,
            rating: 4.8,
            reviews: 124,
            image: '/beetroot-malt.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Boosts Hemoglobin' },
                { icon: <Shield size={20} />, text: 'Immunity Support' },
                { icon: <Leaf size={20} />, text: '100% Natural' },
                { icon: <Users size={20} />, text: 'For All Ages' }
            ],
            ingredients: ['Organic Beetroot', 'Jaggery', 'Cardamom', 'Cashews', 'Almonds', 'Country Sugar'],
            nutrition: { calories: '120 kcal', protein: '4g', calcium: '8%', iron: '15%' }
        },
        'm2': {
            id: 'm2',
            name: 'Sprouted Ragi Malt',
            description: 'The ultimate calcium-rich superfood. Made from sprouted finger millet (Ragi), this malt is easier to digest and maximizes nutrient absorption. Ideal for growing children and bone health.',
            price: 380,
            rating: 4.9,
            reviews: 89,
            image: '/sprouted-ragi-malt.jpg',
            benefits: [
                { icon: <Flame size={20} />, text: 'High Calcium' },
                { icon: <Activity size={20} />, text: 'Easy Digestion' },
                { icon: <Users size={20} />, text: 'Baby Friendly' },
                { icon: <Leaf size={20} />, text: 'Sprouted Goodness' }
            ],
            ingredients: ['Sprouted Ragi', 'Almonds', 'Elachi', 'Country Sugar'],
            nutrition: { calories: '110 kcal', protein: '5g', calcium: '25%', iron: '6%' }
        },
        'm3': {
            id: 'm3',
            name: 'Sprouted Ragi Choco Malt',
            description: 'A delicious twist on health! Combines the benefits of sprouted ragi with rich cocoa. A favorite among kids who refuse plain milk, making nutrition tasty and fun.',
            price: 420,
            rating: 4.7,
            reviews: 56,
            image: '/sprouted-ragi-choco-malt.jpg',
            benefits: [
                { icon: <Heart size={20} />, text: 'Kid Favorite' },
                { icon: <Flame size={20} />, text: 'Energy Booster' },
                { icon: <Leaf size={20} />, text: 'No Preservatives' },
                { icon: <Shield size={20} />, text: 'Rich in Iron' }
            ],
            ingredients: ['Sprouted Ragi', 'Cocoa Powder', 'Country Sugar', 'Nuts'],
            nutrition: { calories: '135 kcal', protein: '4.5g', calcium: '20%', iron: '8%' }
        },
        'm4': {
            id: 'm4',
            name: 'ABC Malt',
            description: 'The miracle combination of Apple, Beetroot, and Carrot. Designed to promote glowing skin and detoxify the body. A daily glass works wonders for your vitality.',
            price: 550,
            rating: 4.9,
            reviews: 210,
            image: '/abc-malt.jpg',
            benefits: [
                { icon: <Leaf size={20} />, text: 'Detoxifying' },
                { icon: <Activity size={20} />, text: 'Glowing Skin' },
                { icon: <Shield size={20} />, text: 'Anti-Aging' },
                { icon: <Users size={20} />, text: 'Vitality Boost' }
            ],
            ingredients: ['Apple', 'Beetroot', 'Carrot', 'Nuts', 'Cardamom'],
            nutrition: { calories: '115 kcal', protein: '3g', calcium: '10%', iron: '12%' }
        },
        'm5': {
            id: 'm5',
            name: 'Red Banana Malt',
            description: 'A traditional remedy for weight gain and energy. Red bananas are superior in potassium and fiber. This malt is excellent for instant energy and healthy weight management.',
            price: 480,
            rating: 4.6,
            reviews: 75,
            image: '/red-banana-malt.jpg',
            benefits: [
                { icon: <Flame size={20} />, text: 'High Energy' },
                { icon: <Activity size={20} />, text: 'Weight Gain' },
                { icon: <Leaf size={20} />, text: 'Rich in Potassium' },
                { icon: <Activity size={20} />, text: 'Nerve Health' }
            ],
            ingredients: ['Red Banana', 'Jaggery', 'Nuts', 'Cardamom'],
            nutrition: { calories: '140 kcal', protein: '2g', calcium: '5%', iron: '4%' }
        },
        'm6': {
            id: 'm6',
            name: 'Nenthiram Banana Malt',
            description: 'Authentic Kerala Nendran banana power. Known for its distinct taste and digestive benefits. Great for gut health and providing sustained energy throughout the day.',
            price: 460,
            rating: 4.8,
            reviews: 92,
            image: '/nenthiram-banana-malt.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Gut Health' },
                { icon: <Flame size={20} />, text: 'Sustained Energy' },
                { icon: <Leaf size={20} />, text: 'Fiber Rich' },
                { icon: <Users size={20} />, text: 'Traditional Recipe' }
            ],
            ingredients: ['Nenthiram Banana', 'Country Sugar', 'Cardamom', 'Nuts'],
            nutrition: { calories: '130 kcal', protein: '2.5g', calcium: '6%', iron: '5%' }
        },
        'a1': {
            id: 'a1',
            name: 'Wheat Atta',
            type: 'atta',
            description: 'Premium whole wheat flour, stone-ground to preserve natural nutrients and fiber. Makes soft, fluffy rotis that stay fresh for longer. Our organic wheat is sourced from certified farms.',
            price: 60,
            rating: 4.8,
            reviews: 215,
            image: '/wheat-atta.jpg',
            benefits: [
                { icon: <Leaf size={20} />, text: 'High Fiber' },
                { icon: <Activity size={20} />, text: 'Easy Digestion' },
                { icon: <Shield size={20} />, text: 'Heart Healthy' },
                { icon: <Users size={20} />, text: 'Daily Staple' }
            ],
            ingredients: ['Organic Whole Wheat'],
            nutrition: { calories: '340 kcal', protein: '13g', fiber: '11g', iron: '20%' },
            usage: 'Ideal for soft Rotis, Chapatis, Parathas, and whole wheat baking.'
        },
        'a2': {
            id: 'a2',
            name: 'Beetroot Atta',
            type: 'atta',
            description: 'Nutrient-rich wheat flour infused with fresh organic beetroot. Adds a vibrant color and mild sweetness to your meals, making them attractive for kids and packed with antioxidants.',
            price: 85,
            rating: 4.7,
            reviews: 142,
            image: '/beetroot-atta.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Boosts Iron' },
                { icon: <Heart size={20} />, text: 'Blood Pressure' },
                { icon: <Leaf size={20} />, text: 'Antioxidant Rich' },
                { icon: <Users size={20} />, text: 'Kid Friendly' }
            ],
            ingredients: ['Whole Wheat', 'Dehydrated Beetroot Powder'],
            nutrition: { calories: '320 kcal', protein: '12g', fiber: '12g', iron: '25%' },
            usage: 'Make colorful Rotis, Poories, or Wraps that kids will love.'
        },
        'a3': {
            id: 'a3',
            name: 'Carrot Atta',
            type: 'atta',
            description: 'Goodness of carrots tailored into your daily flour. Rich in Vitamin A and fiber, this atta supports eye health and digestion while keeping your rotis soft and tasty.',
            price: 85,
            rating: 4.6,
            reviews: 98,
            image: '/carrot-atta.jpg',
            benefits: [
                { icon: <Flame size={20} />, text: 'Eye Health' },
                { icon: <Leaf size={20} />, text: 'Vitamin A Rich' },
                { icon: <Shield size={20} />, text: 'Immunity Boost' },
                { icon: <Activity size={20} />, text: 'Skin Health' }
            ],
            ingredients: ['Whole Wheat', 'Dehydrated Carrot Powder'],
            nutrition: { calories: '330 kcal', protein: '12g', fiber: '11g', iron: '15%' },
            usage: 'Perfect for nutrient-dense Rotis, Parathas, and healthy snacks.'
        },
        'a4': {
            id: 'a4',
            name: 'Ragi Atta',
            type: 'atta',
            description: 'Pure Finger Millet flour, a powerhouse of calcium and fiber. Excellent for bone health, weight management, and controlling blood sugar levels. Gluten-free friendly option.',
            price: 70,
            rating: 4.9,
            reviews: 180,
            image: '/ragi-atta.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'High Calcium' },
                { icon: <Flame size={20} />, text: 'Weight Loss' },
                { icon: <Shield size={20} />, text: 'Diabetic Friendly' },
                { icon: <Leaf size={20} />, text: 'Gluten Free' }
            ],
            ingredients: ['Organic Ragi (Finger Millet)'],
            nutrition: { calories: '320 kcal', protein: '7g', calcium: '35%', fiber: '18%' },
            usage: 'Use for Ragi Mudde, Dosa, Porridge, or mix with wheat flour for Rotis.'
        },
        'a5': {
            id: 'a5',
            name: 'ABC Atta',
            type: 'atta',
            description: 'The ultimate health blend! Apple, Beetroot, and Carrot combined with premium wheat. A complete package of vitamins, minerals, and flavor for a super-healthy meal.',
            price: 120,
            rating: 4.9,
            reviews: 210,
            image: '/abc-atta.jpg',
            benefits: [
                { icon: <Shield size={20} />, text: 'Total Wellness' },
                { icon: <Activity size={20} />, text: 'Detox Support' },
                { icon: <Leaf size={20} />, text: 'Multi-Vitamin' },
                { icon: <Users size={20} />, text: 'Tasty & Healthy' }
            ],
            ingredients: ['Whole Wheat', 'Apple', 'Beetroot', 'Carrot'],
            nutrition: { calories: '310 kcal', protein: '11g', fiber: '14g', iron: '22%' },
            usage: 'The best choice for nutritious breakfasts and lunchbox Rotis.'
        },
        // Snacks & Sweets
        's1': {
            id: 's1',
            name: 'Ragi Karupatti Halwa',
            type: 'sweet',
            description: 'A traditional healthy sweet made with organic ragi milk and palm jaggery (Karupatti). A perfect blend of health and taste, rich in calcium and iron. Melt-in-mouth texture with deep earthy sweetness.',
            price: 280,
            rating: 4.8,
            reviews: 156,
            image: '/ragi-karupatti-halwa.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Vitamins Rich' },
                { icon: <Heart size={20} />, text: 'Iron Boost' },
                { icon: <Leaf size={20} />, text: 'Natural Sweetener' },
                { icon: <Shield size={20} />, text: 'Bone Health' }
            ],
            ingredients: ['Sprouted Ragi Milk', 'Palm Jaggery (Karupatti)', 'Pure Ghee', 'Cardamom', 'Cashews'],
            nutrition: { calories: '380 kcal', fat: '12g', calcium: '20%', iron: '18%' },
            taste: ['Rich & Creamy', 'Melt-in-Mouth', 'Earthy Sweetness'],
            bestFor: ['Festival Sweets', 'Healthy Indulgence', 'Kids & Elders'],
            storage: 'Store in a cool dry place. Shelf life: 20 days. Refrigerate for longer freshness.'
        },
        's2': {
            id: 's2',
            name: 'Thodhal Halwa',
            type: 'sweet',
            description: 'An authentic Tirunelveli specialty. This black halwa is made with palm jaggery, coconut milk, and red rice flour. Known for its unique sticky, chewy texture and rich aroma.',
            price: 320,
            rating: 4.9,
            reviews: 89,
            image: '/thodhal-halwa.jpg',
            benefits: [
                { icon: <Leaf size={20} />, text: 'Authentic Taste' },
                { icon: <Flame size={20} />, text: 'Energy Source' },
                { icon: <Shield size={20} />, text: 'No White Sugar' },
                { icon: <Users size={20} />, text: 'Festive Special' }
            ],
            ingredients: ['Red Rice Flour', 'Palm Jaggery', 'Thick Coconut Milk', 'Ghee', 'Cardamom'],
            nutrition: { calories: '410 kcal', fat: '15g', carbs: '65g', protein: '4g' },
            taste: ['Chewy & Sticky', 'Classic South Indian', 'Coconut Aroma'],
            bestFor: ['Traditional Gifts', 'Special Occasions', 'Dessert Lovers'],
            storage: 'Best consumed within 15 days. Keep in an airtight container.'
        },
        's3': {
            id: 's3',
            name: 'Wheat Milk Halwa',
            type: 'sweet',
            description: 'Smooth, glossy, and absolutely divine. Extracted wheat milk slow-cooked with ghee and caramelized sugar creates a texture that simply slides down your throat.',
            price: 300,
            rating: 4.7,
            reviews: 112,
            image: '/wheat-milk-halwa.jpg',
            benefits: [
                { icon: <Heart size={20} />, text: 'Classic Flavor' },
                { icon: <Activity size={20} />, text: 'Instant Energy' },
                { icon: <Users size={20} />, text: 'Crowd Favorite' },
                { icon: <Check size={20} />, text: 'Pure Ghee' }
            ],
            ingredients: ['Wheat Milk', 'Sugar', 'Pure Ghee', 'Cashews'],
            nutrition: { calories: '450 kcal', fat: '18g', carbs: '70g', protein: '5g' },
            taste: ['Glossy & Soft', 'Rich Caramel', 'Buttery Finish'],
            bestFor: ['Wedding Gifts', 'Evening Snack', 'Celebrations'],
            storage: 'Shelf life: 10 days. Warm slightly before serving for best taste.'
        },
        's7': {
            id: 's7',
            name: 'Peanut Laddu',
            type: 'sweet',
            description: 'Traditional groundnut balls (Kadalai Urundai) sweetened with jaggery. Crunchy, nutty, and packed with protein. The perfect nostalgia trip to childhood snacks.',
            price: 180,
            rating: 4.8,
            reviews: 240,
            image: '/peanut-laddu.jpg',
            benefits: [
                { icon: <Flame size={20} />, text: 'High Protein' },
                { icon: <Activity size={20} />, text: 'Energy Bar' },
                { icon: <Leaf size={20} />, text: 'Iron Rich' },
                { icon: <Shield size={20} />, text: 'No Preservatives' }
            ],
            ingredients: ['Roasted Peanuts', 'Jaggery', 'Cardamom', 'Ginger Powder (Sukku)'],
            nutrition: { calories: '520 kcal', protein: '24g', fat: '30g', iron: '15%' },
            taste: ['Crunchy', 'Nutty', 'Jaggery Sweetness'],
            bestFor: ['School Snacks', 'Tiffin Box', 'Travel Snack'],
            storage: 'Store in airtight jar. Stays crisp for 30 days.'
        },
        's8': {
            id: 's8',
            name: 'Ragi Laddu',
            type: 'sweet',
            description: 'Soft and melt-in-mouth laddus made from roasted ragi flour and ghee. A guilt-free way to enjoy sweets while getting a dose of calcium.',
            price: 200,
            rating: 4.9,
            reviews: 134,
            image: '/ragi-laddu.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Calcium Rich' },
                { icon: <Heart size={20} />, text: 'Heart Friendly' },
                { icon: <Leaf size={20} />, text: 'Fiber Packed' },
                { icon: <Users size={20} />, text: 'For Kids' }
            ],
            ingredients: ['Ragi Flour', 'Powdered Sugar', 'Ghee', 'Cashews'],
            nutrition: { calories: '400 kcal', protein: '8g', calcium: '30%', fiber: '10%' },
            taste: ['Soft & Crumbly', 'Mild Sweetness', 'Roasted Flavor'],
            bestFor: ['After School Snack', 'Healthy Dessert', 'Pregnancy Diet'],
            storage: 'Consumbe within 15 days. Keep away from moisture.'
        },
        's9': {
            id: 's9',
            name: 'Coconut Laddu',
            type: 'sweet',
            description: 'Fresh grated coconut cooked with sugar and cardamom. Juicy, chewy, and bursting with tropical flavor. A festive favorite in every Indian home.',
            price: 220,
            rating: 4.7,
            reviews: 95,
            image: '/coconut-laddu.jpg',
            benefits: [
                { icon: <Leaf size={20} />, text: 'Fresh Coconut' },
                { icon: <Activity size={20} />, text: 'Instant Boost' },
                { icon: <Shield size={20} />, text: 'Cooling Effect' },
                { icon: <Check size={20} />, text: 'Gluten Free' }
            ],
            ingredients: ['Fresh Coconut', 'Sugar', 'Ghee', 'Milk Solids'],
            nutrition: { calories: '350 kcal', fat: '20g', fiber: '5g', protein: '3g' },
            taste: ['Juicy', 'Chewy', 'Sweet & Milky'],
            bestFor: ['Diwali Sweets', 'Prasadam', 'Tea Time'],
            storage: 'Refrigerate immediately. Consumbe within 5 days.'
        },
        // Noodles & Pasta
        'np1': {
            id: 'np1',
            name: 'Beetroot Noodles',
            type: 'noodle',
            description: 'Vibrant and nutritious noodles made with organic beetroot for natural color and health benefits. A fun way to add antioxidants to your diet without compromising on taste.',
            price: 120,
            originalPrice: 150,
            rating: 4.8,
            reviews: 145,
            image: '/beetroot-noodles.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Rich in Iron' },
                { icon: <Leaf size={20} />, text: 'No Maida' },
                { icon: <Shield size={20} />, text: 'Sun Dried' },
                { icon: <Heart size={20} />, text: 'No Preservatives' }
            ],
            ingredients: ['Premium Wheat Flour', 'Beetroot Puree', 'Salt', 'Water'],
            nutrition: { calories: '360 kcal', protein: '12g', carbs: '75g', iron: '15%' },
            usage: 'Boil for 5-7 mins. Stir fry with veggies for a healthy meal.',
            bestFor: ['Lunchbox', 'Dinner', 'Kids Meal']
        },
        'np2': {
            id: 'np2',
            name: 'Beetroot Pasta',
            type: 'pasta',
            description: 'Colorful pasta infused with beetroot, delicious and wholesome. Made from durum wheat and fresh beetroot, providing a healthy twist to your favorite Italian dishes.',
            price: 130,
            originalPrice: 160,
            rating: 4.7,
            reviews: 98,
            image: '/beetroot-pasta-premium.jpg',
            benefits: [
                { icon: <Heart size={20} />, text: 'Heart Healthy' },
                { icon: <Flame size={20} />, text: 'Fiber Rich' },
                { icon: <Users size={20} />, text: 'Kids Love It' },
                { icon: <Leaf size={20} />, text: '100% Natural' }
            ],
            ingredients: ['Durum Wheat Semolina', 'Beetroot Juice'],
            nutrition: { calories: '350 kcal', protein: '11g', fiber: '8g', iron: '12%' },
            usage: 'Cook al dente in 8-10 mins. Serve with white or red sauce.',
            bestFor: ['Healthy Dinner', 'Weekend Treat', 'Salads']
        },
        'np3': {
            id: 'np3',
            name: 'Ragi Noodles',
            type: 'noodle',
            description: 'Protein-rich finger millet noodles packed with calcium and iron. A guilt-free noodle option that supports bone health and boosts energy levels naturally.',
            price: 110,
            originalPrice: 140,
            rating: 4.9,
            reviews: 210,
            image: '/ragi-noodles-premium.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'High Calcium' },
                { icon: <Shield size={20} />, text: 'Bone Strength' },
                { icon: <Leaf size={20} />, text: 'Simple Carbs' },
                { icon: <Check size={20} />, text: 'Diabetic Friendly' }
            ],
            ingredients: ['Wheat Flour', 'Finger Millet (Ragi)', 'Salt'],
            nutrition: { calories: '340 kcal', protein: '10g', calcium: '25%', iron: '18%' },
            usage: 'Excellent for Hakka noodles or spicy Schezwan style.',
            bestFor: ['Breakfast', 'Pre-workout', 'Light Dinner']
        },
        'np4': {
            id: 'np4',
            name: 'Ragi Pasta',
            type: 'pasta',
            description: 'Healthy pasta made from ragi flour, ideal for a nutritious meal. Combines the goodness of ancient grains with modern convenience. Gluten-friendly and easy to digest.',
            price: 125,
            originalPrice: 155,
            rating: 4.8,
            reviews: 135,
            image: '/ragi-pasta-premium.jpg',
            benefits: [
                { icon: <Flame size={20} />, text: 'Sustained Energy' },
                { icon: <Activity size={20} />, text: 'Rich in Minerals' },
                { icon: <Leaf size={20} />, text: 'Unrefined' },
                { icon: <Users size={20} />, text: 'Weight Mgmt' }
            ],
            ingredients: ['Durum Wheat', 'Ragi Flour'],
            nutrition: { calories: '330 kcal', protein: '9g', fiber: '9g', calcium: '20%' },
            usage: 'Best enjoyed with creamy mushroom or pesto sauce.',
            bestFor: ['Lunch', 'Weight Watchers', 'Kids']
        },
        'np5': {
            id: 'np5',
            name: 'Carrot Noodles',
            type: 'noodle',
            description: 'Bright orange noodles enriched with fresh organic carrots. Loaded with Vitamin A for eye health and natural sweetness that children adore. No artificial colors.',
            price: 115,
            originalPrice: 145,
            rating: 4.7,
            reviews: 80,
            image: '/carrot-noodles-premium.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Eye Health' },
                { icon: <Leaf size={20} />, text: 'Vitamin A' },
                { icon: <Shield size={20} />, text: 'Immunity' },
                { icon: <Heart size={20} />, text: 'Gut Friendly' }
            ],
            ingredients: ['Wheat Flour', 'Carrot Puree', 'Salt'],
            nutrition: { calories: '355 kcal', protein: '11g', carbs: '74g', vitaminA: '40%' },
            usage: 'Great for vegetable stir-fry or noodle soup.',
            bestFor: ['Lunchbox', 'Pickyeaters', 'Quick Meal']
        },
        'np6': {
            id: 'np6',
            name: 'Carrot Pasta',
            type: 'pasta',
            description: 'Delicious pasta with natural carrot flavor and nutrients. A fantastic way to sneak vegetables into your kids meals. Vibrant color and great texture.',
            price: 130,
            originalPrice: 160,
            rating: 4.6,
            reviews: 72,
            image: '/carrot-pasta-premium.jpg',
            benefits: [
                { icon: <Leaf size={20} />, text: 'Antioxidants' },
                { icon: <Activity size={20} />, text: 'Skin Health' },
                { icon: <Flame size={20} />, text: 'Low GI' },
                { icon: <Users size={20} />, text: 'Family Meal' }
            ],
            ingredients: ['Durum Wheat Semolina', 'Carrot Juice'],
            nutrition: { calories: '345 kcal', protein: '10g', fiber: '7g', vitaminA: '35%' },
            usage: 'Pairs beautifully with tangy tomato or arrabbiata sauce.',
            bestFor: ['Dinner', 'Potluck', 'Kids Party']
        },
        'np7': {
            id: 'np7',
            name: 'Palak Noodles',
            type: 'noodle',
            description: 'Green spinach noodles loaded with iron and essential nutrients. Experience the goodness of greens in every slurpy bite. Perfect for a healthy Asian style meal.',
            price: 125,
            originalPrice: 155,
            rating: 4.9,
            reviews: 160,
            image: '/palak-noodles-premium-v2.jpg',
            benefits: [
                { icon: <Shield size={20} />, text: 'Iron Boost' },
                { icon: <Leaf size={20} />, text: 'Detoxifying' },
                { icon: <Activity size={20} />, text: 'Strength' },
                { icon: <Heart size={20} />, text: 'Clean Eating' }
            ],
            ingredients: ['Wheat Flour', 'Spinach Puree', 'Salt'],
            nutrition: { calories: '350 kcal', protein: '13g', iron: '20%', fiber: '6g' },
            usage: 'Try with garlic butter and herbs or soy sauce stir fry.',
            bestFor: ['Post-workout', 'Lunch', 'Health Enthusiasts']
        },
        'np8': {
            id: 'np8',
            name: 'Palak Pasta',
            type: 'pasta',
            description: 'Nutritious spinach pasta that combines taste with health. The vibrant green color makes your pasta dish look gourmet and healthy. Packed with leafy greens goodness.',
            price: 135,
            originalPrice: 165,
            rating: 4.8,
            reviews: 110,
            image: '/palak-pasta-premium.jpg',
            benefits: [
                { icon: <Activity size={20} />, text: 'Superfood' },
                { icon: <Leaf size={20} />, text: 'High Fiber' },
                { icon: <Flame size={20} />, text: 'Metabolism' },
                { icon: <Check size={20} />, text: 'Natural Color' }
            ],
            ingredients: ['Durum Wheat', 'Spinach Extract'],
            nutrition: { calories: '340 kcal', protein: '11g', iron: '18%', fiber: '8g' },
            usage: 'Cooks well with cheese sauce or aglio e olio.',
            bestFor: ['Fancy Dinner', 'Date Night', 'Healthy Comfort']
        },
        // Wellness Products
        'w1': {
            id: 'w1',
            name: 'Amla Gulkand',
            type: 'wellness',
            description: 'A refreshing and wellness-enhancing blend of Indian gooseberry (Amla) and rose petals. This traditional ayurvedic jam naturally cools the body, boosts immunity, and improves digestion.',
            price: 350,
            rating: 4.9,
            reviews: 65,
            image: '/amla-gulkand-premium.png',
            benefits: [
                { icon: <Shield size={20} />, text: 'Immunity' },
                { icon: <Leaf size={20} />, text: 'Cooling' },
                { icon: <Activity size={20} />, text: 'Digestion' },
                { icon: <Heart size={20} />, text: 'Skin Glow' }
            ],
            ingredients: ['Organic Amla', 'Fresh Rose Petals', 'Mishri (Rock Sugar)', 'Cardamom'],
            nutrition: { calories: '280 kcal', vitaminC: '450mg', iron: '4mg', acidity: 'Low' },
            usage: 'Take 1 tsp morning and evening. Can be spread on toast/chapati.',
            bestFor: ['Acidity Relief', 'Summer Cooler', 'Skin Health'],
            storage: 'Store in cool place. Use dry spoon.'
        },
        'w2': {
            id: 'w2',
            name: 'Amla Candy',
            type: 'wellness',
            description: 'Nutritious and tangy fruit snack made from dried Indian gooseberries. A powerhouse of Vitamin C that tastes like candy but works like medicine for your immunity.',
            price: 220,
            rating: 4.8,
            reviews: 120,
            image: '/amla-candy-premium.png',
            benefits: [
                { icon: <Shield size={20} />, text: 'High Vitamin C' },
                { icon: <Activity size={20} />, text: 'Antioxidant' },
                { icon: <Flame size={20} />, text: 'Metabolism' },
                { icon: <Users size={20} />, text: 'Kids Love It' }
            ],
            ingredients: ['Dried Amla', 'Sulfur-less Sugar', 'Cumin', 'Black Salt'],
            nutrition: { calories: '300 kcal', vitaminC: '600mg', protein: '1g', fiber: '6g' },
            usage: 'Eat 3-4 pieces daily as a healthy snack.',
            bestFor: ['Immunity', 'Travel Snack', 'After Meal'],
            storage: 'Airtight container. shelf life 6 months.'
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            // Check if static product exists
            if (productDatabase[id]) {
                setLoading(false);
                return;
            }

            // Otherwise fetch from database
            try {
                const found = await fetchWithCache(`${API_URL}/products/${id}`);
                if (found) {
                    setDynamicProduct({
                        id: found.id,
                        name: found.name,
                        description: found.description,
                        price: found.price,
                        rating: 5.0,
                        reviews: 0,
                        image: getOptimizedImageUrl(found.image_url, 800) || '/placeholder-well.jpg',
                        benefits: [
                            { icon: <Shield size={20} />, text: '100% Certified' },
                            { icon: <Leaf size={20} />, text: 'Naturally Grown' }
                        ],
                        ingredients: ['Natural Source'],
                        nutrition: { calories: 'N/A', protein: 'N/A', fiber: 'N/A', iron: 'N/A' }
                    });
                }
            } catch (err) {
                console.error("Error fetching dynamic product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    const product = productDatabase[id] || dynamicProduct;

    // Reset selected image index and scroll to top on product change
    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedImageIdx(0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-earthy-900 mb-4">Product Not Found</h2>
                    <Link to="/catalogue" className="text-organic-600 hover:underline">Back to Catalogue</Link>
                </div>
            </div>
        );
    }

    const imageList = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : (product.image_url ? [product.image_url] : []));

    const currentImage = imageList[selectedImageIdx] || product.image || product.image_url;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        showToast(`${quantity} x ${product.name} added to cart!`);
    };

    return (
        <div className="min-h-screen pt-20 md:pt-10 pb-20 bg-[#FAF9F6] font-sans overflow-x-hidden">
            {/* Nav Back */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-3 md:mb-8 mt-2 md:mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-earthy-100/50 rounded-full text-earthy-600 hover:text-organic-700 hover:border-organic-300 hover:shadow-md transition-all duration-300 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: Visuals & Trust */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex flex-col gap-3 sm:gap-6 md:gap-8"
                    >
                        {/* 1. Main Product Image */}
                        <div className="relative">
                            <div className="aspect-square max-h-[280px] sm:max-h-[360px] md:max-h-none w-full bg-white rounded-2xl sm:rounded-3xl md:rounded-[3rem] shadow-md sm:shadow-xl md:shadow-2xl overflow-hidden relative border border-white/50 z-10 mx-auto">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-organic-50/50 rounded-[40%] blur-3xl -z-10 animate-pulse" />

                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover relative z-10 hover:scale-105 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
                                />

                                {/* 100% Organic Badge */}
                                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md border border-organic-100 flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-organic-500 animate-pulse" />
                                    <span className="text-organic-800 font-bold text-[10px] sm:text-xs tracking-wider uppercase">100% Organic</span>
                                </div>
                            </div>

                            <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-100 rounded-full blur-xl -z-0 opacity-60" />
                            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-organic-100 rounded-full blur-xl -z-0 opacity-60" />
                        </div>

                        {/* 2. Thumbnails Row (Only shown if multiple distinct images are added) */}
                        {imageList.length > 1 && (
                            <div className="flex gap-2 sm:gap-4 justify-center">
                                {imageList.map((imgSrc, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImageIdx(i)}
                                        className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl border-2 ${selectedImageIdx === i ? 'border-organic-500 shadow-sm ring-1 ring-organic-100' : 'border-transparent bg-white'} overflow-hidden cursor-pointer hover:border-organic-300 transition-all transform hover:-translate-y-0.5`}
                                    >
                                        <img src={imgSrc} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Desktop Only: Trust & Promise (Hidden on mobile) */}
                        <div className="hidden lg:block space-y-8 mt-2">
                            {/* Farmer's Note Card */}
                            <div className="bg-[#1A2E16] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10" />
                                <div className="relative z-10">
                                    <h3 className="font-display text-2xl font-bold mb-3 flex items-center gap-2">
                                        <Heart size={20} className="text-organic-300" fill="currentColor" /> Farmer's Promise
                                    </h3>
                                    <p className="text-white/80 leading-relaxed text-sm mb-6">
                                        "We source our {product.ingredients[0]} directly from organic farms in Tamil Nadu. Every batch of <strong>{product.name}</strong> is handcrafted to ensure you get the purest nutrition possible."
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">PL</div>
                                        <div>
                                            <p className="font-bold text-sm">Purazya</p>
                                            <p className="text-xs text-white/60">Co-operative Society</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3">
                                    <div className="p-2 bg-organic-50 rounded-lg text-organic-600"><Shield size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-earthy-900 text-sm">Lab Tested</h4>
                                        <p className="text-xs text-earthy-500">For Purity</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Users size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-earthy-900 text-sm">Family Safe</h4>
                                        <p className="text-xs text-earthy-500">All Ages</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Check size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-earthy-900 text-sm">No Sugar</h4>
                                        <p className="text-xs text-earthy-500">Added</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-earthy-100 flex items-center gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-red-600"><Heart size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-earthy-900 text-sm">Homemade</h4>
                                        <p className="text-xs text-earthy-500">Recipe</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    {/* RIGHT COLUMN: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-3 sm:space-y-5"
                    >
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-earthy-900 leading-snug">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-organic-700 tracking-tight">₹{product.price}</span>
                            <span className="text-xs sm:text-base text-earthy-400 font-medium line-through decoration-earthy-300">₹{Math.floor(product.price * 1.2)}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-organic-700 bg-organic-50 border border-organic-100 px-2 py-0.5 rounded-full">20% OFF</span>
                        </div>

                        {/* Description */}
                        <p className="text-earthy-600 text-xs sm:text-sm md:text-base leading-relaxed border-l-2 md:border-l-4 border-organic-300 pl-2.5 sm:pl-3.5">
                            {product.description}
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {product.benefits && product.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 sm:gap-2.5 bg-white p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl shadow-sm border border-earthy-100">
                                    <div className="text-organic-600 bg-organic-50 p-1 sm:p-1.5 rounded-lg shrink-0 scale-90 sm:scale-100">
                                        {benefit.icon}
                                    </div>
                                    <span className="font-bold text-earthy-700 text-[11px] sm:text-xs md:text-sm leading-tight truncate">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row gap-2 sm:gap-3 pt-2 sm:pt-4 pb-2 sm:pb-4 border-t border-b border-earthy-100">
                            {/* Quantity */}
                            <div className="flex items-center justify-between bg-white border border-earthy-200 rounded-xl sm:rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 min-w-[90px] sm:min-w-[130px]">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-earthy-500 hover:text-organic-600 transition-colors active:scale-95"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <span className="text-sm sm:text-base font-bold text-earthy-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-earthy-500 hover:text-organic-600 transition-colors active:scale-95"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>

                            {/* Add To Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#1A2E16] text-white rounded-xl sm:rounded-full px-4 py-2.5 sm:py-3.5 font-bold text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#2F4F2C] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                            >
                                <ShoppingCart size={16} />
                                <span>ADD TO BASKET</span>
                            </button>
                        </div>

                        {/* Extra Details */}
                        <div className="space-y-3 sm:space-y-5 pt-1">
                            <div>
                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-earthy-900 mb-1.5 flex items-center gap-1.5">
                                    <Leaf size={14} className="text-organic-500" /> Ingredients
                                </h3>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {product.ingredients.map((ing, i) => (
                                        <span key={i} className="bg-earthy-100/60 text-earthy-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-medium border border-earthy-200/50">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-earthy-900 mb-1.5 flex items-center gap-1.5">
                                    <Activity size={14} className="text-organic-500" /> Nutrition Highlights (Per 100g)
                                </h3>
                                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                    {Object.entries(product.nutrition).map(([key, value]) => (
                                        <div key={key} className="bg-white p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-center shadow-sm border border-earthy-50">
                                            <p className="text-earthy-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-0.5">{key}</p>
                                            <p className="text-earthy-900 font-bold text-xs sm:text-sm">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-earthy-900 mb-1.5 flex items-center gap-1.5">
                                    <Droplets size={14} className="text-organic-500" /> {product.type === 'atta' ? 'Usage & Storage' : 'How to Consume'}
                                </h3>
                                {product.type === 'atta' ? (
                                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-earthy-100 text-xs sm:text-sm">
                                        <p className="font-bold text-earthy-800 mb-1">Best For:</p>
                                        <p className="text-earthy-600 mb-2">{product.usage}</p>
                                        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-bold text-earthy-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><Check size={12} /> Stone Ground</span>
                                            <span className="flex items-center gap-1"><Check size={12} /> Cool Dry Place</span>
                                            <span className="flex items-center gap-1"><Check size={12} /> 6 Months Life</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-1.5 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-earthy-100">
                                        <div className="text-center flex-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-organic-100 rounded-full flex items-center justify-center text-organic-700 font-bold mx-auto mb-1 text-xs sm:text-sm">1</div>
                                            <p className="text-[10px] sm:text-xs font-bold text-earthy-600 leading-tight">Add 2 Scoops</p>
                                        </div>
                                        <div className="w-3 sm:w-6 h-[1px] bg-earthy-200" />
                                        <div className="text-center flex-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-organic-100 rounded-full flex items-center justify-center text-organic-700 font-bold mx-auto mb-1 text-xs sm:text-sm">2</div>
                                            <p className="text-[10px] sm:text-xs font-bold text-earthy-600 leading-tight">Mix Hot Milk</p>
                                        </div>
                                        <div className="w-3 sm:w-6 h-[1px] bg-earthy-200" />
                                        <div className="text-center flex-1">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-organic-100 rounded-full flex items-center justify-center text-organic-700 font-bold mx-auto mb-1 text-xs sm:text-sm">3</div>
                                            <p className="text-[10px] sm:text-xs font-bold text-earthy-600 leading-tight">Stir & Enjoy</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>

                    {/* Mobile Only: Trust & Promise (Moved to bottom) */}
                    <div className="lg:hidden mt-2 space-y-3">
                        {/* Farmer's Note Card */}
                        <div className="bg-[#1A2E16] rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-md">
                            <div className="relative z-10">
                                <h3 className="font-display text-lg sm:text-xl font-bold mb-2 flex items-center gap-1.5">
                                    <Heart size={16} className="text-organic-300" fill="currentColor" /> Farmer's Promise
                                </h3>
                                <p className="text-white/80 leading-relaxed text-xs sm:text-sm mb-3">
                                    "We source our {product.ingredients[0]} directly from organic farms in Tamil Nadu. Every batch of <strong>{product.name}</strong> is handcrafted for purest nutrition."
                                </p>
                                <div className="flex items-center gap-2 border-t border-white/10 pt-2.5">
                                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">PL</div>
                                    <div>
                                        <p className="font-bold text-xs">Purazya</p>
                                        <p className="text-[10px] text-white/60">Co-operative Society</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-earthy-100 flex items-center gap-2">
                                <div className="p-1.5 bg-organic-50 rounded-lg text-organic-600"><Shield size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-earthy-900 text-xs">Lab Tested</h4>
                                    <p className="text-[10px] text-earthy-500">For Purity</p>
                                </div>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-earthy-100 flex items-center gap-2">
                                <div className="p-1.5 bg-yellow-50 rounded-lg text-yellow-600"><Users size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-earthy-900 text-xs">Family Safe</h4>
                                    <p className="text-[10px] text-earthy-500">All Ages</p>
                                </div>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-earthy-100 flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Check size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-earthy-900 text-xs">No Sugar</h4>
                                    <p className="text-[10px] text-earthy-500">Added</p>
                                </div>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-earthy-100 flex items-center gap-2">
                                <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><Heart size={16} /></div>
                                <div>
                                    <h4 className="font-bold text-earthy-900 text-xs">Homemade</h4>
                                    <p className="text-[10px] text-earthy-500">Recipe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ProductDetail;
