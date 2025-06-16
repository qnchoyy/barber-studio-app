import api from '../axios';

export const adminServicesAPI = {
    getAll: async () => {
        const response = await api.get('/api/services/all-services');
        return response.data;
    },

    create: async (serviceData) => {
        const response = await api.post('/api/services/create-service', serviceData);
        return response.data;
    },

    update: async (id, serviceData) => {
        const response = await api.patch(`/api/services/update/${id}`, serviceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/services/delete/${id}`);
        return response.data;
    },

};