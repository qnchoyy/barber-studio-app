import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminScheduleAPI } from '../../api/аdmin/schedule';

export const useAdminSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        try {
            const result = await adminScheduleAPI.getAll();
            if (result.success) {
                setSchedules(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Error fetching schedules:', err);
            toast.error('Грешка при зареждане на работното време');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const createSchedule = async (day, slots) => {
        setActionLoading(`create-${day}`);
        try {
            const result = await adminScheduleAPI.create(day, slots);
            if (result.success) {
                toast.success(`✅ Работното време за ${day} е създадено`);
                setSchedules(prev => [...prev, result.data]);
                return { success: true };
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Error creating schedule:', err);
            toast.error(err.message || 'Грешка при създаване');
            return { success: false };
        } finally {
            setActionLoading(null);
        }
    };

    const updateSchedule = async (day, slots) => {
        setActionLoading(`update-${day}`);
        try {
            const result = await adminScheduleAPI.update(day, slots);
            if (result.success) {
                toast.success(`✅ Работното време за ${day} е обновено`);
                setSchedules(prev =>
                    prev.map(schedule =>
                        schedule.day === day
                            ? { ...schedule, slots: result.data.slots }
                            : schedule
                    )
                );
                return { success: true };
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Error updating schedule:', err);
            toast.error(err.message || 'Грешка при обновяване');
            return { success: false };
        } finally {
            setActionLoading(null);
        }
    };

    const deleteSchedule = async (day) => {
        setActionLoading(`delete-${day}`);
        try {
            const result = await adminScheduleAPI.remove(day);
            if (result.success) {
                toast.success(`✅ ${day} е направен почивен ден`);
                setSchedules(prev => prev.filter(schedule => schedule.day !== day));
                return { success: true };
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Error deleting schedule:', err);
            toast.error(err.message || 'Грешка при изтриване');
            return { success: false };
        } finally {
            setActionLoading(null);
        }
    };

    return {
        schedules,
        loading,
        actionLoading,

        createSchedule,
        updateSchedule,
        deleteSchedule,
        fetchSchedules
    };
};