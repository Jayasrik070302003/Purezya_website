const pool = require('../config/db');

const normalizeImageUrl = (imageUrl, req) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
        return imageUrl;
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    return imageUrl.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1):\d+(\/uploads\/.*)$/i, `${protocol}://${host}$2`);
};

// Get products (with optional category and limit)
exports.getAllProducts = async (req, res) => {
    try {
        const { category, limit, offset, search } = req.query;
        let query = 'SELECT * FROM products';
        let queryParams = [];
        let conditions = [];

        if (category) {
            queryParams.push(category);
            conditions.push(`category = $${queryParams.length}`);
        }

        if (search) {
            queryParams.push(`%${search}%`);
            conditions.push(`name ILIKE $${queryParams.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        if (limit) {
            queryParams.push(parseInt(limit));
            query += ` LIMIT $${queryParams.length}`;
        }

        if (offset) {
            queryParams.push(parseInt(offset));
            query += ` OFFSET $${queryParams.length}`;
        }

        const { rows: products } = await pool.query(query, queryParams);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows: products } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, category, description, price, stock, image_url } = req.body;
    const productImageUrl = normalizeImageUrl(image_url, req);

    // Basic validation
    if (!name || !category || !price) {
        return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (name, category, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, category, description, price, stock || 0, productImageUrl]
        );

        const newProduct = {
            id: result.rows[0].id,
            name,
            category,
            description,
            price,
            stock,
            image_url: productImageUrl,
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
    const productImageUrl = normalizeImageUrl(image_url, req);

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, stock = $5, image_url = $6 WHERE id = $7',
            [name, category, description, price, stock, productImageUrl, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ id, name, category, description, price, stock, image_url: productImageUrl });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};
