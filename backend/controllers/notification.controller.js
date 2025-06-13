import Notification from '../models/Notification.model.js';

export const getAdminNotifications = async (req, res) => {
    try {
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const skip = (page - 1) * limit;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments(),
            Notification.countDocuments({ unread: true })
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: notifications,
            pagination: { total, totalPages, page, limit },
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching notifications.' });
    }
};


export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notif = await Notification.findById(id);
        if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });

        notif.unread = false;
        await notif.save();

        res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Server error while marking notification as read.' });
    }
};


export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ unread: true }, { $set: { unread: false } });
        res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Server error while marking all notifications as read.' });
    }
};
