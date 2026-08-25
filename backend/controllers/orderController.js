const pool = require('../config/db');

exports.createOrder = async (req, res) => {
    const { items, totalAmount, status, paymentMethod, shippingDetails } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insert Order
        // Note: shippingDetails and paymentMethod are received but we need to update the schema to store them.
        // For now, we proceed with existing columns.
        // Ideally: ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50), ADD COLUMN shipping_address TEXT;

        const orderResult = await client.query(
            'INSERT INTO orders (total_amount, status, payment_method, shipping_address) VALUES ($1, $2, $3, $4) RETURNING id',
            [totalAmount, status || 'Pending', paymentMethod, typeof shippingDetails === 'object' ? JSON.stringify(shippingDetails) : shippingDetails]
        );

        const orderId = orderResult.rows[0].id;

        // 2. Insert Order Items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
                [orderId, item.productId, item.name, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');

        console.log(`Order #${orderId} created successfully`);

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
