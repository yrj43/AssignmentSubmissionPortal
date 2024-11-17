const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded);

        const user = await User.findOne({ 
            _id: decoded.id,
            customId: decoded.adminId
        });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;

        console.log('Authenticated user:', {
            id: user._id,
            customId: user.customId,
            role: user.role
        });

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No user found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        console.log('Admin verification passed:', {
            userId: req.user.customId,
            role: req.user.role
        });

        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(403).json({ error: 'Access denied' });
    }
};

module.exports = { auth, isAdmin };