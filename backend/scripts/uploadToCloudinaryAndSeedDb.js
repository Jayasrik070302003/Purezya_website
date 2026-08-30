const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../config/db');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
});

const sourceDir = 'C:\\Users\\vasan\\Documents\\Purazya';

const categoriesData = [
    {
        name: 'Malt Beverages',
        folder: 'malt-beverages',
        description: 'Traditional wholesome grain & fruit energy malts for vitality and strength.',
        products: [
            {
                file: 'ABC.jpg',
                name: 'ABC Malt',
                price: 550,
                description: 'The miracle powerhouse blend of Apple, Beetroot, and Carrot. Promotes radiant glowing skin, natural detox, and sustained everyday energy.'
            },
            {
                file: 'Betroot.jpg',
                name: 'Beetroot Malt',
                price: 450,
                description: 'Crafted from nutrient-dense organic beetroots, roasted to retain essential iron and antioxidants to naturally boost hemoglobin and immunity.'
            },
            {
                file: 'Neenthiram.jpg',
                name: 'Nendran Banana Malt',
                price: 460,
                description: 'Authentic Kerala Nendran banana power packed with natural potassium and dietary fiber for digestive balance and all-day vitality.'
            },
            {
                file: 'Ragi.jpg',
                name: 'Sprouted Ragi Malt',
                price: 380,
                description: 'Calcium-rich superfood crafted from naturally sprouted finger millet (Ragi). Promotes bone strength, easy digestion, and healthy development.'
            },
            {
                file: 'Red Banana.jpg',
                name: 'Red Banana Malt',
                price: 480,
                description: 'Traditional energy formulation made with nutrient-rich red bananas. Excellent for healthy weight management, muscle recovery, and stamina.'
            },
            {
                file: 'Sprouted Ragi Choco malt.png',
                name: 'Sprouted Ragi Choco Malt',
                price: 420,
                description: 'Wholesome sprouted ragi paired with natural cocoa. A delicious, nutrient-packed chocolate malt loved by kids and adults alike.'
            }
        ]
    },
    {
        name: 'Organic Atta',
        folder: 'organic-atta',
        description: 'Stone-ground whole grain & fiber-packed organic flours.',
        products: [
            {
                file: 'ABC Atta (multi-grain).jpg',
                name: 'ABC Multi-Grain Atta',
                price: 340,
                description: 'Super-grain blend enriched with Apple, Beetroot, and Carrot extracts along with whole wheat and millets for wholesome family rotis.'
            },
            {
                file: 'Beetroot atta.jpg',
                name: 'Beetroot Atta',
                price: 320,
                description: 'Fiber-rich flour infused with natural beetroot. Makes vibrant, nutritious pink rotis rich in iron and vital micro-nutrients.'
            },
            {
                file: 'Carrot atta.jpg',
                name: 'Carrot Atta',
                price: 320,
                description: 'Infused with fresh farm-grown carrots, high in beta-carotene and Vitamin A. Soft, fluffy rotis with a subtle natural sweetness.'
            },
            {
                file: 'Ragi atta.jpg',
                name: 'Ragi Atta',
                price: 260,
                description: '100% pure stone-ground finger millet flour. Gluten-friendly and exceptionally high in calcium for healthy dosas, rotis, and porridge.'
            },
            {
                file: 'Wheat Atta (whole wheat).jpg',
                name: 'Whole Wheat Atta',
                price: 240,
                description: 'Traditional chakki-fresh 100% whole grain wheat flour with natural bran intact for extra soft rotis and optimal gut health.'
            }
        ]
    },
    {
        name: 'Noodles & Pasta',
        folder: 'noodles-pasta',
        description: 'Nutrient-rich handmade millet and vegetable pastas & noodles with zero maida.',
        products: [
            {
                file: 'Betroot Noodles.jpg',
                name: 'Beetroot Noodles',
                price: 180,
                description: 'Guilt-free vegetable noodles made from organic beetroot and whole grains. 100% Maida-free, rich in iron, and air-dried.'
            },
            {
                file: 'Betroot Pasta.jpg',
                name: 'Beetroot Pasta',
                price: 190,
                description: 'Wholesome artisan pasta infused with farm-fresh beetroot. Deliciously textured and packed with dietary fiber and natural color.'
            },
            {
                file: 'carrot noodles.jpg',
                name: 'Carrot Noodles',
                price: 180,
                description: 'Nourishing carrot-infused noodles with natural Vitamin A and antioxidants. A wholesome, quick dinner loved by kids.'
            },
            {
                file: 'carrot pasta.jpg',
                name: 'Carrot Pasta',
                price: 190,
                description: 'Made from durum semolina and pure carrot puree. Perfectly holds sauces while adding essential vegetable nutrition.'
            },
            {
                file: 'Carrot penny Pasta.jpg',
                name: 'Carrot Penne Pasta',
                price: 195,
                description: 'Classic Penne shaped pasta naturally enriched with farm carrots. High protein, high fiber, and chemical-free.'
            },
            {
                file: 'palak noodles.jpg',
                name: 'Palak Noodles',
                price: 180,
                description: 'Spinach-enriched whole grain noodles delivering essential iron, folate, and chlorophyll. Wholesome and easy to prepare.'
            },
            {
                file: 'Palak Penny pasta.jpg',
                name: 'Palak Penne Pasta',
                price: 195,
                description: 'Penne pasta made with fresh organic spinach and durum wheat. Brings green vibrancy and rich nutrition to your Italian dishes.'
            },
            {
                file: 'Ragi noodles.jpg',
                name: 'Ragi Noodles',
                price: 180,
                description: 'Calcium-packed millet noodles made from premium finger millet. Naturally gluten-friendly, light on the stomach, and delicious.'
            },
            {
                file: 'Ragi pasta.jpg',
                name: 'Ragi Pasta',
                price: 190,
                description: 'Artisanal finger millet pasta crafted for health-conscious families. High fiber, low GI, and 100% natural.'
            }
        ]
    },
    {
        name: 'Snacks & Sweets',
        folder: 'snacks-sweets',
        description: 'Artisanal traditional sweets made with pure jaggery & natural ingredients.',
        products: [
            {
                file: 'Ash Gourd Halwa.jpg',
                name: 'Ash Gourd Halwa',
                price: 360,
                description: 'Traditional Kasi Halwa crafted from cooling ash gourd, pure ghee, and unrefined sugar. Melt-in-mouth texture with rich aroma.'
            },
            {
                file: 'Carrot Halwa.jpg',
                name: 'Carrot Halwa',
                price: 340,
                description: 'Rich, slow-cooked red carrot halwa enriched with pure farm milk, cow ghee, roasted cashews, and cardamom.'
            },
            {
                file: 'Cocunet Laddu.jpg',
                name: 'Coconut Laddu',
                price: 280,
                description: 'Freshly grated coconut roasted in pure desi ghee and bound with traditional jaggery. Soft, fragrant, and deeply comforting.'
            },
            {
                file: 'Palkova.jpg',
                name: 'Traditional Palkova',
                price: 380,
                description: 'Authentic village-style milk sweet simmered for hours from pure cows milk and cane sugar. Incomparably rich and traditional.'
            },
            {
                file: 'Penut Laddu.jpg',
                name: 'Peanut Laddu',
                price: 260,
                description: 'Crunchy roasted peanuts bound with organic jaggery and cardamom. High protein energy snack perfect for quick nourishment.'
            },
            {
                file: 'Pumkin Halwa.jpg',
                name: 'Pumpkin Halwa',
                price: 350,
                description: 'Golden yellow pumpkin slow cooked with organic jaggery, cardamom, and ghee. Rich in vitamins and natural fiber.'
            },
            {
                file: 'Ragi Karupatti Halwa.jpg',
                name: 'Ragi Karupatti Halwa',
                price: 390,
                description: 'Heritage delicacy made from sprouted ragi extract and pure palm jaggery (Karupatti). Iron-rich and preservative-free.'
            },
            {
                file: 'Ragi Laddu.jpg',
                name: 'Ragi Laddu',
                price: 280,
                description: 'Roasted finger millet flour combined with country sugar, roasted nuts, and pure ghee. A healthy calcium-loaded treat.'
            },
            {
                file: 'Red aval laddu.jpg',
                name: 'Red Aval Laddu',
                price: 270,
                description: 'Nutritious red rice flakes (Aval) roasted and blended with country sugar and ghee. Light, aromatic, and easy to digest.'
            },
            {
                file: 'Thodhal Halwa.png',
                name: 'Thodhal Halwa',
                price: 420,
                description: 'Rare coastal heritage delicacy made with coconut milk, black rice extract, and palm jaggery. Silky, rich, and unforgettable.'
            },
            {
                file: 'wheat Milk Halwa.jpg',
                name: 'Wheat Milk Halwa',
                price: 380,
                description: 'Authentic Tirunelveli-style wheat milk halwa extracted from fermented whole wheat, cooked in pure ghee with roasted cashews.'
            }
        ]
    },
    {
        name: 'Healthy Foods & Beverages',
        folder: 'Healthy Foods & Beverages',
        description: 'Pure wellness superfoods, herbal blends & vitality boosters.',
        products: [
            {
                file: 'Amla Candy.jpg',
                name: 'Organic Amla Candy',
                price: 240,
                description: 'Sun-dried Indian gooseberries infused with organic cane sugar. A powerhouse of natural Vitamin C for daily immunity and digestion.'
            },
            {
                file: 'amla gulkhand.jpg',
                name: 'Amla Gulkand',
                price: 380,
                description: 'Therapeutic blend of native Damask rose petals and fresh amla cured in natural rock sugar. Natural coolant and digestive elixir.'
            },
            {
                file: 'Penut Butter.png',
                name: 'All-Natural Peanut Butter',
                price: 320,
                description: '100% slow-roasted premium peanuts with zero hydrogenated oils, zero palm oil, and zero preservatives. Pure creamy protein.'
            },
            {
                file: 'Red Aval with mixed nuts and natural sweeteners.jpg',
                name: 'Red Aval Nutri-Mix',
                price: 290,
                description: 'Wholesome red rice flakes enriched with crunchy almonds, cashews, raisins, and natural sweeteners. Ready to eat super-breakfast.'
            },
            {
                file: 'Satvik.jpg',
                name: 'Satvik Health Mix',
                price: 450,
                description: 'Ancient Ayurvedic blend of sprouted millets, pulses, and medicinal herbs. Provides balanced nourishment and serene vitality.'
            }
        ]
    }
];

async function uploadToCloudinary(filePath, publicId) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            {
                folder: 'Purazya_products',
                public_id: publicId,
                overwrite: true,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
    });
}

async function run() {
    console.log('🚀 Starting Cloudinary Upload & Database Seeding from:', sourceDir);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Clean tables
        await client.query('DELETE FROM products');
        await client.query('DELETE FROM categories');

        let totalProducts = 0;

        for (const cat of categoriesData) {
            console.log(`\n📁 Processing Category: ${cat.name}`);
            
            // Insert category
            const catRes = await client.query(
                `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name`,
                [cat.name, cat.description]
            );
            console.log(`   ✅ Created category ID: ${catRes.rows[0].id}`);

            const catSrcDir = path.join(sourceDir, cat.folder);

            for (const prod of cat.products) {
                const srcFilePath = path.join(catSrcDir, prod.file);
                const safePublicId = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                
                let cloudinaryUrl = '';

                if (fs.existsSync(srcFilePath)) {
                    console.log(`   ☁️ Uploading to Cloudinary: ${prod.file}...`);
                    cloudinaryUrl = await uploadToCloudinary(srcFilePath, safePublicId);
                    console.log(`   ✅ Cloudinary URL: ${cloudinaryUrl}`);
                } else {
                    console.warn(`   ⚠️ Local file not found at: ${srcFilePath}`);
                    cloudinaryUrl = `/Product images/${prod.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
                }

                // Insert Product into Database with Cloudinary URL
                const prodRes = await client.query(
                    `INSERT INTO products (name, category, description, price, stock, image_url)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING id, name, category, price, image_url`,
                    [prod.name, cat.name, prod.description, prod.price, 100, cloudinaryUrl]
                );

                totalProducts++;
                console.log(`   📦 Inserted Product #${prodRes.rows[0].id}: ${prodRes.rows[0].name} (₹${prodRes.rows[0].price}) [${prodRes.rows[0].category}]`);
            }
        }

        await client.query('COMMIT');
        console.log(`\n🎉 Successfully uploaded all images to Cloudinary and seeded ${categoriesData.length} categories with ${totalProducts} products!`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during Cloudinary upload & DB seed:', err);
    } finally {
        client.release();
        process.exit(0);
    }
}

run();
