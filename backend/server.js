import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.js'
import connectToDB from './config/db.js';

import serviceRouter from './routes/service.routes.js';
import bookingRouter from './routes/booking.routes.js';
import authRouter from './routes/auth.routes.js';
import { autoCompleteBookings } from './jobs/autoCompleteBookings.job.js';
import scheduleRouter from './routes/schedule.routes.js';

connectToDB();
autoCompleteBookings();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/auth', authRouter);
app.use('/api/schedule', scheduleRouter);

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});