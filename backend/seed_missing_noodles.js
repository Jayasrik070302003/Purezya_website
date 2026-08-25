const pool = require('./config/db');

const seedMissingNoodles = async () => {
    const products = [
        {
            name: 'Ragi Pasta',
            category: 'Noodles & Pasta',
            description: 'Healthy pasta made from ragi flour, ideal for a nutritious and filling meal.',
            price: 125,
            stock: 60,
            image_url: '/ragi-pasta-premium.jpg'
        },
        {
            name: 'Carrot Noodles',
            category: 'Noodles & Pasta',
            description: 'Bright orange noodles enriched with fresh organic carrots for added vitamins.',
            price: 115,
            stock: 60,
            image_url: '/carrot-noodles-premium.jpg'
        },
        {
            name: 'Carrot Pasta',
            category: 'Noodles & Pasta',
            description: 'Delicious pasta with natural carrot flavor and nutrients for the whole family.',
            price: 130,
            stock: 60,
            image_url: '/carrot-pasta-premium.jpg'
        },
        {
            name: 'Palak Noodles',
            category: 'Noodles & Pasta',
            description: 'Green spinach noodles loaded with iron and essential nutrients for healthy living.',
            price: 125,
            stock: 60,
            image_url: '/palak-noodles-premium-v2.jpg'
        },
        {
            name: 'Palak Pasta',
            category: 'Noodles & Pasta',
            description: 'Nutritious spinach pasta that combines taste with health in every bite.',
            price: 135,
            stock: 60,
            image_url: '/palak-pasta-premium.jpg'
        }
    ];

    try {
        console.log('Seeding missing noodles & pasta...');
        for (const product of products) {
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

seedMissingNoodles();
