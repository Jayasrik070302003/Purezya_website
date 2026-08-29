const pool = require('../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        // Fetch real stats from database
        const { rows: productCountResult } = await pool.query('SELECT COUNT(*) as count FROM products');
        const { rows: orderStatsResult } = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = \'Pending\'');
        const { rows: totalOrdersResult } = await pool.query('SELECT COUNT(*) as count FROM orders');

        const totalProducts = productCountResult[0].count;
        const pendingOrders = orderStatsResult[0].count;
        const totalOrders = totalOrdersResult[0].count;

        const userName = req.user?.name || 'Friend';
        const data = {
            welcomeMessage: `Welcome to Purazya, ${userName}!`,
            stats: [
                { title: 'Total Products', value: totalProducts.toLocaleString(), color: '#059669' },
                { title: 'Active Orders', value: totalOrders.toLocaleString(), color: '#10b981' },
                { title: 'Pending Deliveries', value: pendingOrders.toLocaleString(), color: '#34d399' }
            ],
            categories: [
                { id: 1, name: 'Malt Beverages', image: '/malt-beverage.jpg' },
                { id: 2, name: 'Organic Atta', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
                { id: 3, name: 'Snacks & Sweets', image: '/snacks-sweets.jpg' },
                { id: 4, name: 'Noodles & Pasta', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&q=80' },
                { id: 5, name: 'Wellness Products', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80' }
            ]
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};
