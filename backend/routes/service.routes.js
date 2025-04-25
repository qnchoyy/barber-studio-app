import { Router } from 'express';
import { createService, getAllServices } from '../controllers/service.controller.js';

const serviceRouter = Router();

serviceRouter.get('/', getAllServices);

serviceRouter.post('/', createService);

export default serviceRouter;