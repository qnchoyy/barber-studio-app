import { useState, useEffect } from 'react';
import { statsAPI } from '../../api/аdmin/stats';

import toast from 'react-hot-toast';

export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentStatsResult = await statsAPI.getCurrent();

            if (!currentStatsResult.success) {
                throw new Error('Failed to fetch current stats');
            }

            setStats(currentStatsResult.data);

        } catch (error) {
            console.error('Error fetching stats:', error);
            setError(error.message);
            toast.error('Грешка при зареждане на статистиките');
        }
    };

    const fetchRecentBookings = async () => {
        try {
            const result = await statsAPI.getRecentBookings(6);
            if (result.success) {
                setRecentBookings(result.data);
            }
        } catch (error) {
            console.error('Error fetching recent bookings:', error);
            setRecentBookings([]);
        }
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchStats(),
            fetchRecentBookings()
        ]);
        setLoading(false);
    };

    const refetch = () => {
        fetchAllData();
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        stats,
        recentBookings,
        loading,
        error,
        refetch,
    };
};