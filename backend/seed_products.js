const pool = require('./config/db');

const seedProducts = async () => {
    const products = [
        // Malt Beverages
        { name: 'Beetroot Malt', category: 'Malt Beverages', price: 450, stock: 50, description: 'Rich in iron and boosts immunity naturally.', image_url: '/beetroot-malt.jpg' },
        { name: 'Sprouted Ragi Malt', category: 'Malt Beverages', price: 380, stock: 50, description: 'Packed with calcium, perfect for kids and adults.', image_url: '/sprouted-ragi-malt.jpg' },
        { name: 'Sprouted Ragi Choco Malt', category: 'Malt Beverages', price: 420, stock: 50, description: 'Healthy ragi with a delicious chocolate twist.', image_url: '/sprouted-ragi-choco-malt.jpg' },
        { name: 'ABC Malt', category: 'Malt Beverages', price: 550, stock: 50, description: 'Apple, Beetroot, Carrot - The miracle drink mix.', image_url: '/abc-malt.jpg' },
        { name: 'Red Banana Malt', category: 'Malt Beverages', price: 480, stock: 50, description: 'High energy and digestion support.', image_url: '/red-banana-malt.jpg' },
        { name: 'Nenthiram Banana Malt', category: 'Malt Beverages', price: 480, stock: 50, description: 'High energy and digestion support.', image_url: '/red-banana-malt.jpg' },
        { name: 'Carrot Malt', category: 'Malt Beverages', price: 450, stock: 50, description: 'Rich in Vitamin A and great for eye health.', image_url: '/carrot-malt.jpg' },

        // Organic Atta
        { name: 'Wheat Atta', category: 'Organic Atta', price: 60, stock: 100, description: 'Premium whole wheat flour for soft rotis.', image_url: '/wheat-atta.jpg' },
        { name: 'Beetroot Atta', category: 'Organic Atta', price: 85, stock: 100, description: 'Nutritious flour infused with fresh beetroot.', image_url: '/beetroot-atta.jpg' },
        { name: 'Carrot Atta', category: 'Organic Atta', price: 85, stock: 100, description: 'Healthy carrot-enriched flour for daily use.', image_url: '/carrot-atta.jpg' },
        { name: 'Ragi Atta', category: 'Organic Atta', price: 70, stock: 100, description: 'Rich in calcium and fiber, perfect for health.', image_url: '/ragi-atta.jpg' },
        { name: 'ABC Atta', category: 'Organic Atta', price: 120, stock: 100, description: 'Multi-grain goodness of Apple, Beetroot, Carrot.', image_url: '/abc-atta.jpg' },

        // Snacks & Sweets
        { name: 'Ragi Karupatti Halwa', category: 'Snacks & Sweets', price: 280, stock: 30, description: 'Traditional healthy sweet made with organic ragi and palm jaggery.', image_url: '/ragi-karupatti-halwa.jpg' },
        { name: 'Thodhal Halwa', category: 'Snacks & Sweets', price: 320, stock: 30, description: 'Authentic rich black halwa with a unique sticky texture.', image_url: '/thodhal-halwa.jpg' },
        { name: 'Wheat Milk Halwa', category: 'Snacks & Sweets', price: 300, stock: 30, description: 'Smooth, glossy, and melt-in-the-mouth wheat milk delicacy.', image_url: '/wheat-milk-halwa.jpg' },
        { name: 'Carrot Halwa', category: 'Snacks & Sweets', price: 240, stock: 30, description: 'Classic Indian dessert made with fresh organic carrots and ghee.', image_url: '/carrot-halwa.jpg' },
        { name: 'Ash Gourd Halwa', category: 'Snacks & Sweets', price: 240, stock: 30, description: 'Unique and delightful sweet from Kashi (Kashi Halwa).', image_url: '/ash-gourd-halwa.jpg' },
        { name: 'Peanut Laddu', category: 'Snacks & Sweets', price: 180, stock: 40, description: 'Protein-packed roasted peanut balls sweetened with jaggery.', image_url: '/peanut-laddu.jpg' },
        { name: 'Ragi Laddu', category: 'Snacks & Sweets', price: 200, stock: 40, description: 'Nutritious finger millet energy balls for a healthy snack.', image_url: '/ragi-laddu.jpg' },

        // Noodles & Pasta
        { name: 'Beetroot Noodles', category: 'Noodles & Pasta', price: 120, stock: 60, description: 'Vibrant and nutritious noodles made with organic beetroot.', image_url: '/beetroot-noodles.jpg' },
        { name: 'Beetroot Pasta', category: 'Noodles & Pasta', price: 130, stock: 60, description: 'Colorful pasta infused with beetroot.', image_url: '/beetroot-pasta-premium.jpg' },
        { name: 'Ragi Noodles', category: 'Noodles & Pasta', price: 110, stock: 60, description: 'Protein-rich finger millet noodles.', image_url: '/ragi-noodles-premium.jpg' },

        // Wellness Products
        { name: 'Amla Gulkand', category: 'Wellness Products', price: 350, stock: 25, description: 'Refreshing & wellness-enhancing Indian gooseberry jam.', image_url: '/amla-gulkand-premium.png' },
        { name: 'Amla Candy', category: 'Wellness Products', price: 220, stock: 25, description: 'Nutritious fruit snack made from dried Indian gooseberries.', image_url: '/amla-candy-premium.png' }
    ];

    try {
        console.log('Seeding products...');
        for (const product of products) {
            // Check if product already exists to avoid duplicates
            const [existing] = await pool.execute('SELECT id FROM products WHERE name = ?', [product.name]);
            if (existing.length === 0) {
                await pool.execute(
                    'INSERT INTO products (name, category, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                    [product.name, product.category, product.description, product.price, product.stock, product.image_url]
                );
                console.log(`Added: ${product.name}`);
            } else {
                console.log(`Skipped (exists): ${product.name}`);
            }
        }
        console.log('Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
