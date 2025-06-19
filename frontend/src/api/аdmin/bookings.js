import api from '../axios';

export const adminBookingsAPI = {
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            params.append('page', filters.page || 1);
            params.append('limit', filters.limit || 10);

            if (filters.status) params.append('status', filters.status);
            params.append('sort', filters.sort || 'desc');
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await api.get(`/api/bookings/all-bookings?${params}`);
            return response.data;

        } catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                success: false,
                data: [],
                currentPage: filters.page || 1,
                totalPages: 1,
                totalBookings: 0,
                message: error.response?.data?.message || 'Грешка при зареждане на резервациите',
            };
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/api/bookings/details/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booking details:', error);
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'Грешка при зареждане на резервацията',
            };
        }
    },

    updateStatus: async (id, status) => {
        try {
            const response = await api.patch(`/api/bookings/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating booking status:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Грешка при промяна на статуса',
            };
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/api/bookings/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting booking:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Грешка при изтриване на резервацията',
            };
        }
    },
};