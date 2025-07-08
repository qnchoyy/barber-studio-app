import { Router } from 'express';
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
} from '../controllers/adminUsers.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const adminUsersRouter = Router();

adminUsersRouter.use(protect, adminOnly);

adminUsersRouter.get('/', getAllUsers);

adminUsersRouter.patch('/:id/role', updateUserRole);

adminUsersRouter.delete('/:id', deleteUser);

export default adminUsersRouter;