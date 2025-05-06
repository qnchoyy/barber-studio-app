import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';


const userRouter = Router();

userRouter.get('/my-profile', protect, getUserProfile);
userRouter.patch('/my-profile/update', protect, updateUserProfile);

export default userRouter;