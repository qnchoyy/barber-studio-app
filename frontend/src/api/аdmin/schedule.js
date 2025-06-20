import api from '../axios';

export const adminScheduleAPI = {

    getAll: async () => {
        const response = await api.get('/api/schedule/all');
        return response.data;
    },

    create: async (day, slots) => {
        const response = await api.post('/api/schedule/create', { day, slots });
        return response.data;
    },

    update: async (day, slots) => {
        const response = await api.patch(`/api/schedule/update/${encodeURIComponent(day)}`, { slots });
        return response.data;
    },

    remove: async (day) => {
        const response = await api.delete(`/api/schedule/delete/${encodeURIComponent(day)}`);
        return response.data;
    },
};