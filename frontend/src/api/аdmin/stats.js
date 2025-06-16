import api from '../axios';

export const statsAPI = {
    getCurrent: async () => {
        const response = await api.get('/api/bookings/admin/stats');
        return response.data;
    },

    getLastMonth: async () => {
        const response = await api.get('/api/bookings/admin/stats?period=lastMonth');
        return response.data;
    },

    getRecentBookings: async (limit = 6) => {
        const response = await api.get(`/api/bookings/admin/recent?limit=${limit}`);
        return response.data;
    },

    getPendingBookings: async (limit = 10) => {
        const response = await api.get(`/api/bookings/admin/pending?limit=${limit}`);
        return response.data;
    },

    getMonthlyRevenue: async () => {
        const response = await api.get('/api/bookings/admin/monthly-revenue');
        return response.data;
    },
};