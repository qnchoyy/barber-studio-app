import { useState, useEffect } from 'react';
import { adminServicesAPI } from '../../api/аdmin/services';
import toast from 'react-hot-toast';

export const useAdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await adminServicesAPI.getAll();
            if (result.success) {
                setServices(result.data);
            } else {
                throw new Error(result.message || 'Неуспешно зареждане');
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            setError(err.message);
            toast.error('Грешка при зареждане на услугите');
        } finally {
            setLoading(false);
        }
    };

    const createService = async (serviceData) => {
        setActionLoading('create');
        try {
            const result = await adminServicesAPI.create(serviceData);
            if (result.success) {
                setServices(prev => [...prev, result.data]);
                toast.success('✅ Услугата е създадена успешно!');
                return { success: true, data: result.data };
            }
            throw new Error(result.message);
        } catch (err) {
            console.error('Error creating service:', err);
            toast.error(err.message || 'Грешка при създаване на услугата');
            return { success: false, error: err.message };
        } finally {
            setActionLoading(null);
        }
    };

    const updateService = async (id, serviceData) => {
        setActionLoading(`update-${id}`);
        try {
            const result = await adminServicesAPI.update(id, serviceData);
            if (result.success) {
                setServices(prev =>
                    prev.map(s => (s._id === id ? result.data : s))
                );
                toast.success('✅ Услугата е обновена успешно!');
                return { success: true, data: result.data };
            }
            throw new Error(result.message);
        } catch (err) {
            console.error('Error updating service:', err);
            toast.error(err.message || 'Грешка при обновяване на услугата');
            return { success: false, error: err.message };
        } finally {
            setActionLoading(null);
        }
    };

    const deleteService = async (id) => {
        setActionLoading(`delete-${id}`);
        try {
            const result = await adminServicesAPI.delete(id);
            if (result.success) {
                setServices(prev => prev.filter(s => s._id !== id));
                toast.success('✅ Услугата е изтрита успешно!');
                return { success: true };
            }
            throw new Error(result.message);
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error(err.message || 'Грешка при изтриване на услугата');
            return { success: false, error: err.message };
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return {
        services,
        loading,
        error,
        actionLoading,
        fetchServices,
        createService,
        updateService,
        deleteService,
    };
};
