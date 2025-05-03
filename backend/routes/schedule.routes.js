import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';
import { createSchedule } from '../controllers/controllers/schedule.controller.js';

const scheduleRouter = Router();

scheduleRouter.post('/create', protect, adminOnly, createSchedule);

export default scheduleRouter;
