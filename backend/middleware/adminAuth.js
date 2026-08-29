const auth = require('./auth');

const requireAdmin = (req, res, next) => {
    auth(req, res, () => {
        const userEmail = (req.user?.email || '').trim().toLowerCase();
        const isAdmin = userEmail === 'admin@purazya.com' || userEmail === 'admin@gmail.com';

        if (!isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    });
};

module.exports = requireAdmin;
