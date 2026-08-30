const pool = require('../config/db');

// Get all categories with product count
exports.getAllCategories = async (req, res) => {
    try {
        // Query categories along with product count
        const { rows: categories } = await pool.query(`
            SELECT c.id, c.name, c.description, c.created_at,
                   COUNT(p.id)::int as count
            FROM categories c
            LEFT JOIN products p ON p.category = c.name
            GROUP BY c.id, c.name, c.description, c.created_at
            ORDER BY c.name ASC
        `);

        // If categories table is completely empty, extract existing distinct categories from products
        if (categories.length === 0) {
            const { rows: productCategories } = await pool.query(`
                SELECT DISTINCT category as name, COUNT(id)::int as count
                FROM products
                WHERE category IS NOT NULL AND category != ''
                GROUP BY category
                ORDER BY category ASC
            `);

            if (productCategories.length > 0) {
                return res.json(productCategories.map((c, i) => ({ id: i + 1, name: c.name, count: c.count })));
            }

            // Default starter categories
            const defaultCats = [
                { id: 1, name: 'Malt Beverages', count: 0 },
                { id: 2, name: 'Organic Atta', count: 0 },
                { id: 3, name: 'Snacks & Sweets', count: 0 },
                { id: 4, name: 'Noodles & Pasta', count: 0 },
                { id: 5, name: 'Wellness Products', count: 0 }
            ];
            return res.json(defaultCats);
        }

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();

    try {
        // Check if category already exists
        const { rows: existing } = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [trimmedName]);
        if (existing.length > 0) {
            return res.status(200).json(existing[0]);
        }

        const { rows } = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at',
            [trimmedName, description || '']
        );

        res.status(201).json({ ...rows[0], count: 0 });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error creating category' });
    }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();

    try {
        // Get old category name to update existing products
        const { rows: oldCat } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (oldCat.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const oldName = oldCat[0].name;

        // Update category record
        const { rows: updated } = await pool.query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [trimmedName, description || '', id]
        );

        // Update products referencing this category
        if (oldName !== trimmedName) {
            await pool.query('UPDATE products SET category = $1 WHERE category = $2', [trimmedName, oldName]);
        }

        res.json(updated[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error updating category' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows: cat } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (cat.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error deleting category' });
    }
};
