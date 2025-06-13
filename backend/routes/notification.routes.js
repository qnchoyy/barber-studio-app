import { Router } from 'express';
import {
    getAdminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const NotificationRouter = Router();

NotificationRouter.use(protect, adminOnly);
NotificationRouter.get('/', getAdminNotifications);
NotificationRouter.patch('/:id/read', markNotificationAsRead);
NotificationRouter.patch('/mark-all-read', markAllNotificationsAsRead);

export default NotificationRouter;
