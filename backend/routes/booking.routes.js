import { Router } from 'express';
import { createBooking, getAllBookings, getMyBookings } from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const bookingRouter = Router();

bookingRouter.post('/create-booking', protect, createBooking);

bookingRouter.get('/all-bookings', protect, adminOnly, getAllBookings);

bookingRouter.get('/my-bookings', protect, getMyBookings);

export default bookingRouter;