import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message?.toLowerCase() || '';

            const tokenExpiredMessages = [
                'jwt expired',
                'token expired',
                'expired',
                'unauthorized',
                'not authorized'
            ];

            const isTokenExpired = tokenExpiredMessages.some(msg =>
                errorMessage.includes(msg)
            );

            if (isTokenExpired) {
                console.log('🔑 Token expired, logging out user...');

                localStorage.removeItem('token');
                localStorage.removeItem('user');

                toast.error('Сесията ви е изтекла. Моля, влезте отново.', {
                    duration: 5000,
                    style: {
                        background: '#7f1d1d',
                        color: '#fecaca',
                        border: '2px solid #ef4444',
                        padding: '16px',
                        borderRadius: '12px',
                    },
                });

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }

        throw error;
    }
);

export default api;