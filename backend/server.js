const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Prevent Caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/uploads', express.static('uploads'));

// Root path
app.get('/', (req, res) => {
    res.send('Purezya Life\'s Food API is running...');
});

// Database Initialization (Schema)
const initDb = async () => {
    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password_hash VARCHAR(255) NOT NULL,
                profile_picture TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Orders Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INT,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                payment_method VARCHAR(50),
                shipping_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Products Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Order Items Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INT NOT NULL,
                product_id VARCHAR(50),
                product_name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        await client.query('COMMIT');
        client.release();
        console.log('Database schema verified via Neon Postgres');
    } catch (error) {
        console.error('Database initialization error:', error.message);
    }
};

initDb();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
