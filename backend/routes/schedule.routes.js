import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';
import { createSchedule, deleteScheduleByDay, getAllSchedules, getScheduleByDay, updateSchedule } from '../controllers/schedule.controller.js';

const scheduleRouter = Router();

scheduleRouter.post('/create', protect, adminOnly, createSchedule);
scheduleRouter.patch('/update/:day', protect, adminOnly, updateSchedule);
scheduleRouter.get('/day/:day', protect, adminOnly, getScheduleByDay);
scheduleRouter.get('/all', protect, adminOnly, getAllSchedules);
scheduleRouter.delete('/delete/:day', protect, adminOnly, deleteScheduleByDay);

export default scheduleRouter;
