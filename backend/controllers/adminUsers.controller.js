import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";

export const getAllUsers = async (req, res) => {
    try {

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const { role, search } = req.query;

        const query = {};
        if (role && ['admin', 'user'].includes(role)) {
            query.role = role;
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: regex },
                { email: regex },
                { phone: regex }
            ];
        }

        const totalItems = await User.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).json({
            success: true,
            pagination: { page, limit, totalPages, totalItems },
            data: users
        });

    } catch (error) {
        console.error('Грешка при извличане на потребители:', error);
        return res.status(500).json({
            success: false,
            message: 'Възникна грешка при извличане на потребители.'
        });
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Невалидна роля. Моля използвайте "admin" или "user".'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Потребителят не е намерен.'
            });
        }

        return res.status(200).json({
            success: true,
            message: `Ролята на потребителя беше успешно променена на "${role}".`,
            data: user
        });
    } catch (error) {
        console.error('Грешка при updateUserRole:', error);
        return res.status(500).json({
            success: false,
            message: 'Възникна грешка при опит за промяна на ролята.'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user._id.toString() === id) {
            return res
                .status(400)
                .json({ success: false, message: 'Не може да изтриете своя акаунт.' });
        }

        const now = new Date();

        await Booking.deleteMany({
            userId: id,
            status: 'потвърдена',
            date: { $gte: now },
        });

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'Потребителят не е намерен.' });
        }

        return res
            .status(200)
            .json({ success: true, message: 'Потребителят беше изтрит успешно.' });
    } catch (error) {
        console.error('Грешка при deleteUser:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Възникна вътрешна грешка.' });
    }
};