import { Router } from 'express';
import { createService, getAllServices, updateService } from '../controllers/service.controller.js';
import { adminOnly } from '../middlewares/admin.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const serviceRouter = Router();

serviceRouter.get('/all-services', getAllServices);

serviceRouter.post('/create-service', protect, adminOnly, createService);

serviceRouter.patch('/update/:id', protect, adminOnly, updateService);

export default serviceRouter;