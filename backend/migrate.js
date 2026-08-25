require('dotenv').config();
const mysql = require('mysql2/promise');
const { Pool } = require('pg');

const migrate = async () => {
    console.log('Starting data migration...');

    // 1. Connect to MySQL
    const mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // 2. Connect to PostgreSQL (Neon)
    const pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const pgClient = await pgPool.connect();

        // 3. Migrate Users
        console.log('Migrating users...');
        const [users] = await mysqlPool.execute('SELECT * FROM users');
        for (const user of users) {
            await pgClient.query(
                'INSERT INTO users (id, name, email, phone, password_hash, profile_picture, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [user.id, user.name, user.email, user.phone, user.password_hash, user.profile_picture, user.created_at]
            );
        }
        if (users.length > 0) {
            await pgClient.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
        }
        console.log(`Migrated ${users.length} users.`);

        // 4. Migrate Products
        console.log('Migrating products...');
        const [products] = await mysqlPool.execute('SELECT * FROM products');
        for (const product of products) {
            await pgClient.query(
                'INSERT INTO products (id, name, category, description, price, stock, image_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
                [product.id, product.name, product.category, product.description, product.price, product.stock, product.image_url, product.created_at]
            );
        }
        if (products.length > 0) {
            await pgClient.query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");
        }
        console.log(`Migrated ${products.length} products.`);

        // 5. Migrate Orders
        console.log('Migrating orders...');
        const [orders] = await mysqlPool.execute('SELECT * FROM orders');
        for (const order of orders) {
            await pgClient.query(
                'INSERT INTO orders (id, user_id, total_amount, status, payment_method, shipping_address, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [order.id, order.user_id, order.total_amount, order.status, order.payment_method, order.shipping_address, order.created_at]
            );
        }
        if (orders.length > 0) {
            await pgClient.query("SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))");
        }
        console.log(`Migrated ${orders.length} orders.`);

        // 6. Migrate Order Items
        console.log('Migrating order items...');
        const [orderItems] = await mysqlPool.execute('SELECT * FROM order_items');
        for (const item of orderItems) {
            await pgClient.query(
                'INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
                [item.id, item.order_id, item.product_id, item.product_name, item.quantity, item.price]
            );
        }
        if (orderItems.length > 0) {
            await pgClient.query("SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items))");
        }
        console.log(`Migrated ${orderItems.length} order items.`);

        pgClient.release();
        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mysqlPool.end();
        await pgPool.end();
    }
};

migrate();
