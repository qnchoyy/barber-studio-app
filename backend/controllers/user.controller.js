import User from '../models/User.model.js';

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
        if (phone) user.phone = phone;

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