const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
    try {
        console.log('\n=== REGISTRATION REQUEST RECEIVED ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);

        const { name, email, phone, password } = req.body;

        console.log('Extracted fields:', {
            name: name ? `"${name}" (type: ${typeof name})` : 'MISSING',
            email: email ? `"${email}" (type: ${typeof email})` : 'MISSING',
            phone: phone ? `"${phone}" (type: ${typeof phone})` : 'MISSING',
            password: password ? `"${password}" (type: ${typeof password}, length: ${password.length})` : 'MISSING'
        });

        // Validate all required fields
        if (!name || !email || !phone || !password) {
            console.error('Validation failed: Missing required fields');
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Validation failed: Invalid email format');
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            console.error('Validation failed: Password too short');
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user exists
        console.log('Checking if user exists with email:', email);
        const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUsers.length > 0) {
            console.error('Validation failed: User already exists');
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        console.log('Creating user in database...');
        await pool.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4)',
            [name, email, phone, hashedPassword]
        );

        console.log('✅ User registered successfully!');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile_picture: user.profile_picture,
                role: user.email === 'admin@gmail.com' ? 'admin' : 'user'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.body.userId; // Ensure you send userId from frontend
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
