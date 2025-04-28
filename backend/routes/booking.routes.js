import { Router } from 'express';
import { createBooking, getAllBookings } from '../controllers/booking.controller.js';

const bookingRouter = Router();

bookingRouter.post('/create-booking', createBooking);

bookingRouter.get('/all-bookings', getAllBookings);

export default bookingRouter;