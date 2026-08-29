const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1] || req.headers['authorization'] || req.headers['x-auth-token'] || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'purazya_super_secure_jwt_secret_2026_default_key';
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

module.exports = verifyToken;
