import api from '../axios';

export const notificationsAPI = {

    getAdminNotifications: async (limit = 10, page = 1) => {
        try {
            const response = await api.get(
                `/api/admin/notifications?limit=${limit}&page=${page}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return {
                success: false,
                data: [],
                pagination: { total: 0, totalPages: 0, page, limit },
                unreadCount: 0
            };
        }
    },

    markAsRead: async (notificationId) => {
        try {
            const response = await api.patch(
                `/api/admin/notifications/${notificationId}/read`
            );
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return { success: false };
        }
    },


    markAllAsRead: async () => {
        try {
            const response = await api.patch(
                '/api/admin/notifications/mark-all-read'
            );
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return { success: false };
        }
    },
};
