const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { sendOrderConfirmationEmail } = require('../services/emailService');

exports.createOrder = async (req, res) => {
    const { items, totalAmount, status, paymentMethod, shippingDetails } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    // Extract logged in user ID if available
    let userId = req.body.userId || null;
    let userEmail = null;

    const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
    if (authHeader) {
        try {
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            userId = decoded.user?.id || decoded.id || null;
            userEmail = decoded.user?.email || decoded.email || null;
        } catch (e) {
            // Guest or expired token, proceed gracefully
        }
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insert Order with user_id
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [userId, totalAmount, status || 'Pending', paymentMethod, typeof shippingDetails === 'object' ? JSON.stringify(shippingDetails) : shippingDetails]
        );

        const orderId = orderResult.rows[0].id;

        // 2. Insert Order Items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
                [orderId, item.productId || item.id, item.name || item.product_name, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');

        console.log(`Order #${orderId} created successfully`);

        // 3. Send Email Confirmation in background (non-blocking)
        sendOrderConfirmationEmail({
            orderId,
            items,
            totalAmount,
            shippingDetails,
            userEmail
        }).catch(e => console.error('Background email notice:', e.message));

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: orderId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error while placing order' });
    } finally {
        client.release();
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rows: orders } = await pool.query(
            `SELECT o.id, o.total_amount, o.status, o.created_at, o.payment_method, o.shipping_address,
             COALESCE(json_agg(json_build_object('id', oi.id, 'product_name', oi.product_name, 'quantity', oi.quantity, 'price', oi.price)) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};
