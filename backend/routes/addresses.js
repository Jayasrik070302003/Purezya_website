const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET api/addresses
// @desc    Get all saved addresses for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching addresses:', err.message);
        res.status(500).json({ message: 'Server error fetching addresses' });
    }
});

// @route   POST api/addresses
// @desc    Add a new address
// @access  Private
router.post('/', auth, async (req, res) => {
    const { firstName, lastName, email, phone, pincode, address, addressType, isDefault } = req.body;

    if (!firstName || !phone || !pincode || !address) {
        return res.status(400).json({ message: 'First name, mobile, pincode, and address are required' });
    }

    try {
        // Check how many addresses user already has
        const { rows: countRows } = await pool.query(
            'SELECT COUNT(*) as count FROM addresses WHERE user_id = $1',
            [req.user.id]
        );
        const shouldBeDefault = isDefault || countRows[0].count === '0';

        if (shouldBeDefault) {
            await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
        }

        const { rows } = await pool.query(
            `INSERT INTO addresses (user_id, first_name, last_name, email, phone, pincode, address_line, address_type, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                req.user.id,
                firstName,
                lastName || '',
                email || req.user.email || '',
                phone,
                pincode,
                address,
                addressType || 'Home',
                shouldBeDefault
            ]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error('Error adding address:', err.message);
        res.status(500).json({ message: 'Server error adding address' });
    }
});

// @route   PUT api/addresses/:id/default
// @desc    Set address as default
// @access  Private
router.put('/:id/default', auth, async (req, res) => {
    const addressId = req.params.id;
    try {
        await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
        const { rows } = await pool.query(
            'UPDATE addresses SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *',
            [addressId, req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error setting default address:', err.message);
        res.status(500).json({ message: 'Server error setting default address' });
    }
});

// @route   DELETE api/addresses/:id
// @desc    Delete an address
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    const addressId = req.params.id;
    try {
        const { rows } = await pool.query(
            'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
            [addressId, req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        console.error('Error deleting address:', err.message);
        res.status(500).json({ message: 'Server error deleting address' });
    }
});

module.exports = router;
