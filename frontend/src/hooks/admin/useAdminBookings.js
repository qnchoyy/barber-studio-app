import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminBookingsAPI } from '../../api/аdmin/bookings'

export const useAdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        sort: 'desc',
        page: 1,
        limit: 10
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const result = await adminBookingsAPI.getAll({
                page: filters.page,
                limit: filters.limit,
                status: filters.status,
                sort: filters.sort,
                startDate: filters.startDate,
                endDate: filters.endDate
            });

            if (result.success) {
                setBookings(result.data);
                setPagination({
                    currentPage: result.currentPage,
                    limit: filters.limit,
                    totalItems: result.totalBookings,
                    totalPages: result.totalPages
                });
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Fetch bookings error:', err);
            toast.error('Грешка при зареждане на резервации');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchBookings();
    }, [filters.status, filters.startDate, filters.endDate, filters.page]);

    const updateBookingStatus = async (id, status) => {
        setActionLoading(`status-${id}`);
        try {
            const r = await adminBookingsAPI.updateStatus(id, status);
            if (r.success) {
                toast.success(`Резервацията е маркирана като ${status}`);

                setBookings(prev =>
                    prev.map(booking =>
                        booking._id === id ? { ...booking, status } : booking
                    )
                );
            } else {
                toast.error(r.message || 'Грешка при промяна на статуса');
            }
        } catch (err) {
            toast.error('Грешка при промяна на статуса');
        } finally {
            setActionLoading(null);
        }
    };

    const deleteBooking = async (id) => {
        setActionLoading(`delete-${id}`);
        try {
            const r = await adminBookingsAPI.delete(id);
            if (r.success) {
                toast.success('Резервацията е изтрита');

                setBookings(prev => prev.filter(booking => booking._id !== id));

                setPagination(prev => ({
                    ...prev,
                    totalItems: prev.totalItems - 1
                }));
            } else {
                toast.error(r.message || 'Грешка при изтриване');
            }
        } catch (err) {
            toast.error('Грешка при изтриване');
        } finally {
            setActionLoading(null);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }));
    };

    return {
        bookings,
        pagination,
        filters,
        setFilters: updateFilters,
        loading,
        actionLoading,
        fetchBookings,
        updateBookingStatus,
        deleteBooking,
    };
};