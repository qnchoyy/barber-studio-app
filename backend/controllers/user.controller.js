import User from '../models/User.model.js';
import { formatToE164, validateBulgarianPhone } from '../utils/phoneUtils.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (name) user.name = name;

        if (phone) {
            if (!validateBulgarianPhone(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Невалиден телефонен номер. Използвайте формат: 0888123456',
                });
            }

            const normalizedPhone = formatToE164(phone);

            const existingUser = await User.findOne({
                phone: normalizedPhone,
                _id: { $ne: req.user._id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Потребител с този телефонен номер вече съществува.',
                });
            }

            user.phone = normalizedPhone;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: {
                name: user.name,
                phone: user.phone,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};