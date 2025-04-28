import { Router } from 'express';
import { createService, getAllServices } from '../controllers/service.controller.js';

const serviceRouter = Router();

serviceRouter.get('/all-services', getAllServices);

serviceRouter.post('/create-service', createService);

export default serviceRouter;