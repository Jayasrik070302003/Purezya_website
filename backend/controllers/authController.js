const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : '';
        const normalizedName = name ? name.trim().toLowerCase() : '';

        // Validate all required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                missing: {
                    name: !name,
                    email: !email,
                    phone: !phone,
                    password: !password
                }
            });
        }

        if (normalizedName === 'purazya' || normalizedEmail === 'admin@purazya.com' || normalizedEmail === 'admin@gmail.com') {
            return res.status(400).json({ message: 'This account name is reserved' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user exists
        const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        await pool.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4)',
            [name, email, phone, hashedPassword]
        );

        console.log('✅ User registered successfully with phone:', phone);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginIdentifier = (email || '').trim();

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: 'Email/ID and password are required' });
        }

        // Allow login by Email OR Username/ID
        const { rows: users } = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(name) = LOWER($1)',
            [loginIdentifier]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'purazya_super_secure_jwt_secret_2026_default_key';

        // Check admin role
        const userEmail = (user.email || '').trim().toLowerCase();
        const isAdmin = userEmail === 'admin@purazya.com' || userEmail === 'admin@gmail.com';

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: isAdmin ? 'admin' : 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                profile_picture: user.profile_picture,
                role: isAdmin ? 'admin' : 'user'
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, name, email, phone, profile_picture, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const userEmail = (user.email || '').trim().toLowerCase();
        const isAdmin = userEmail === 'admin@purazya.com' || userEmail === 'admin@gmail.com';

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            profile_picture: user.profile_picture,
            role: isAdmin ? 'admin' : 'user'
        });
    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const { rows } = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone) WHERE id = $3 RETURNING id, name, email, phone, profile_picture',
            [name, phone, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: rows[0]
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const avatarUrl = `http://localhost:5001/uploads/profile_pictures/${req.file.filename}`;

        // Update user's avatar in database
        await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [avatarUrl, userId]);

        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl: avatarUrl
        });

    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ message: 'Server error during avatar upload' });
    }
};
