import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { PORT } from './config/env.js';
import connectToDB from './config/db.js';

import { autoCompleteBookings } from './jobs/autoCompleteBookings.job.js';
import { sendBookingReminders } from './jobs/sendReminders.js';

import serviceRouter from './routes/service.routes.js';
import bookingRouter from './routes/booking.routes.js';
import authRouter from './routes/auth.routes.js';
import scheduleRouter from './routes/schedule.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(helmet());

app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many auth requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, slow down.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);

connectToDB();

autoCompleteBookings();
sendBookingReminders();

app.use('/api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/auth', authRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});