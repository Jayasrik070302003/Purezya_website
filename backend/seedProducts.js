const mysql = require('mysql2/promise');
require('dotenv').config();

const productsToSeed = [
    {
        name: 'Classic Malt Beverage',
        category: 'Malt Beverages',
        description: 'Rich and creamy malt beverage, perfect for a quick energy boost.',
        price: 250,
        stock: 50,
        image_url: ''
    },
    {
        name: 'Premium Organic Atta',
        category: 'Organic Atta',
        description: '100% whole wheat organic atta, stone ground for superior texture.',
        price: 450,
        stock: 100,
        image_url: ''
    },
    {
        name: 'Traditional Mixed Sweets',
        category: 'Snacks & Sweets',
        description: 'A delightful assortment of traditional homemade sweets.',
        price: 600,
        stock: 25,
        image_url: ''
    },
    {
        name: 'Millet Noodles',
        category: 'Noodles & Pasta',
        description: 'Healthy and tasty millet noodles, no maida, no preservatives.',
        price: 120,
        stock: 75,
        image_url: ''
    },
    {
        name: 'Herbal Wellness Tea',
        category: 'Wellness Products',
        description: 'A soothing blend of herbs to promote relaxation and well-being.',
        price: 350,
        stock: 40,
        image_url: ''
    }
];

const seed = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // Re-create the table to ensure schema matches (FIX for missing columns)
        await connection.execute('DROP TABLE IF EXISTS products');
        console.log('Dropped existing products table.');

        await connection.execute(`
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created new products table.');

        console.log('Seeding products...');
        for (const p of productsToSeed) {
            await connection.execute(
                'INSERT INTO products (name, category, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [p.name, p.category, p.description, p.price, p.stock, p.image_url]
            );
        }
        console.log('Seeding complete!');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
