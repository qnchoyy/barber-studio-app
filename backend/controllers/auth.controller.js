import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { formatToE164, validateBulgarianPhone } from '../utils/phoneUtils.js';

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }

        if (!validateBulgarianPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Невалиден телефонен номер. Използвайте формат: 0888123456',
            });
        }

        const normalizedPhone = formatToE164(phone);

        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone: normalizedPhone }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists.',
                });
            }
            if (existingUser.phone === normalizedPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this phone number already exists.',
                });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            phone: normalizedPhone
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during registration.',
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during login.',
        });
    }
};