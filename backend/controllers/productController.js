const pool = require('../config/db');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { rows: products } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, category, description, price, stock, image_url } = req.body;

    // Basic validation
    if (!name || !category || !price) {
        return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (name, category, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, category, description, price, stock || 0, image_url]
        );

        const newProduct = {
            id: result.rows[0].id,
            name,
            category,
            description,
            price,
            stock,
            image_url,
            created_at: new Date()
        };

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, stock, image_url } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, stock = $5, image_url = $6 WHERE id = $7',
            [name, category, description, price, stock, image_url, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ id, name, category, description, price, stock, image_url });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};
