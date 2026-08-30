import {
    Activity, Shield, Leaf, Users, Flame, Heart, Check
} from 'lucide-react';

export const productDatabase = {
    'm1': {
        id: 'm1',
        name: 'Beetroot Malt',
        description: 'A powerhouse of iron and antioxidants. Our Beetroot Malt is crafted from premium organic beetroots, roasted to perfection to retain essential nutrients. It naturally boosts immunity and improves hemoglobin levels.',
        price: 450,
        rating: 4.8,
        reviews: 124,
        image: '/Product iamges/beetroot-malt.jpg',
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
        image: '/Product iamges/sprouted-ragi-malt.jpg',
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
        image: '/Product iamges/sprouted-ragi-choco-malt.jpg',
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
        image: '/Product iamges/abc-malt.jpg',
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
        image: '/Product iamges/red-banana-malt.jpg',
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
        image: '/asset/nenthiram-banana-malt.jpg',
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
        image: '/Product iamges/wheat-atta.jpg',
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
        image: '/Product iamges/beetroot-atta.jpg',
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
        image: '/Product iamges/carrot-atta.jpg',
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
        image: '/Product iamges/ragi-atta.jpg',
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
        image: '/Product iamges/abc-atta.jpg',
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
    's1': {
        id: 's1',
        name: 'Ragi Karupatti Halwa',
        type: 'sweet',
        description: 'A traditional healthy sweet made with organic ragi milk and palm jaggery (Karupatti). A perfect blend of health and taste, rich in calcium and iron. Melt-in-mouth texture with deep earthy sweetness.',
        price: 280,
        rating: 4.8,
        reviews: 156,
        image: '/Product iamges/ragi-karupatti-halwa.jpg',
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
        image: '/Product iamges/thodhal-halwa.jpg',
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
        image: '/Product iamges/wheat-milk-halwa.jpg',
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
        image: '/Product iamges/peanut-laddu.jpg',
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
        image: '/Product iamges/ragi-laddu.jpg',
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
        image: '/Product iamges/coconut-laddu.jpg',
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
    'np1': {
        id: 'np1',
        name: 'Beetroot Noodles',
        type: 'noodle',
        description: 'Vibrant and nutritious noodles made with organic beetroot for natural color and health benefits. A fun way to add antioxidants to your diet without compromising on taste.',
        price: 120,
        originalPrice: 150,
        rating: 4.8,
        reviews: 145,
        image: '/Product iamges/beetroot-noodles.jpg',
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
        image: '/Product iamges/beetroot-pasta-premium.jpg',
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
        image: '/Product iamges/ragi-noodles-premium.jpg',
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
        image: '/Product iamges/ragi-pasta-premium.jpg',
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
        image: '/Product iamges/carrot-noodles-premium.jpg',
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
        image: '/Product iamges/carrot-pasta-premium.jpg',
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
        image: '/Product iamges/palak-noodles-premium-v2.jpg',
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
        image: '/Product iamges/palak-pasta-premium.jpg',
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
    'w1': {
        id: 'w1',
        name: 'Amla Gulkand',
        type: 'wellness',
        description: 'A refreshing and wellness-enhancing blend of Indian gooseberry (Amla) and rose petals. This traditional ayurvedic jam naturally cools the body, boosts immunity, and improves digestion.',
        price: 350,
        rating: 4.9,
        reviews: 65,
        image: '/Product iamges/amla-gulkand-premium.png',
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
        image: '/Product iamges/amla-candy-premium.png',
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
