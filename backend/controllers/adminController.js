const pool = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const { rows: users } = await pool.query('SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { rows: users } = await pool.query('SELECT COUNT(*) as count FROM users');
        const { rows: orders } = await pool.query('SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders');
        const { rows: products } = await pool.query('SELECT COUNT(*) as count FROM products');

        res.json({
            totalUsers: users[0].count,
            totalOrders: orders[0].count,
            totalRevenue: orders[0].revenue || 0,
            totalProducts: products[0].count
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { rows: orders } = await pool.query(`
            SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Fetch order basic info
        const { rows: orders } = await pool.query(`
            SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = $1
        `, [orderId]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        // Fetch order items
        const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

        order.items = items;

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Server error fetching order details' });
    }
};
