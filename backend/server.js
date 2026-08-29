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
app.use('/api/upload', require('./routes/upload'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/uploads', express.static('uploads'));

// Health check endpoint for Render & monitoring
app.get(['/health', '/api/health'], (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Purazya API',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root path
app.get('/', (req, res) => {
    res.send('Purazya Organic Foods API is running smoothly.');
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

        // Addresses Table (Multiple Saved Addresses per Customer)
        await client.query(`
            CREATE TABLE IF NOT EXISTS addresses (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100),
                email VARCHAR(255),
                phone VARCHAR(20) NOT NULL,
                pincode VARCHAR(20) NOT NULL,
                address_line TEXT NOT NULL,
                address_type VARCHAR(50) DEFAULT 'Home',
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

        // Seed default Admin user if not exists
        const { rows: adminRows } = await client.query("SELECT * FROM users WHERE email = 'admin@gmail.com'");
        if (adminRows.length === 0) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await client.query(
                "INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4)",
                ['Admin Purazya', 'admin@gmail.com', '9876543210', hashedPassword]
            );
            console.log('✅ Default Admin account seeded (admin@gmail.com / admin123)');
        }

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
