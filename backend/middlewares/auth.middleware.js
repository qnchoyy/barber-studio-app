import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

import { JWT_SECRET } from '../config/env.js'

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        next();

    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
