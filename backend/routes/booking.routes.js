import { Router } from 'express';
import { cancelMyBooking, createBooking, deleteBooking, getAllBookings, getAvailableSlots, getBookingById, getMyBookings, updateBookingStatus } from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const bookingRouter = Router();

bookingRouter.post('/create-booking', protect, createBooking);

bookingRouter.get('/all-bookings', protect, adminOnly, getAllBookings);

bookingRouter.get('/my-bookings', protect, getMyBookings);

bookingRouter.patch('/:id/status', protect, adminOnly, updateBookingStatus);

bookingRouter.get('/details/:id', protect, adminOnly, getBookingById);

bookingRouter.delete('/delete/:id', protect, adminOnly, deleteBooking);

bookingRouter.get('/available-slots', protect, getAvailableSlots);

bookingRouter.patch('/cancel/:id', protect, cancelMyBooking);

export default bookingRouter;