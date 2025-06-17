import { useState, useEffect, useCallback } from 'react';
import { notificationsAPI } from '../../api/аdmin/notifications';

export const useNotifications = (limit = 10) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        const res = await notificationsAPI.getAdminNotifications(limit, page);
        if (res.success) {
            setNotifications(res.data);
            setUnreadCount(res.unreadCount);
            setHasMore(page < res.pagination.totalPages);
        }
        setLoading(false);
    }, [limit, page]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        const res = await notificationsAPI.markAsRead(id);
        if (res.success) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id
                        ? {
                            ...n,
                            unread: false,
                        }
                        : n
                )
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        }
    };

    const markAllAsRead = async () => {
        const res = await notificationsAPI.markAllAsRead();
        if (res.success) {
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
            setUnreadCount(0);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        hasMore,
        page,
        setPage,
        markAsRead,
        markAllAsRead,
    };
};
