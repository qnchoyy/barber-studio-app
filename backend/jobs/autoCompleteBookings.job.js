import cron from 'node-cron';
import Booking from '../models/Booking.model.js';

export const autoCompleteBookings = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            const bookings = await Booking.find({ status: 'потвърдена' });

            let updatedCount = 0;

            for (let booking of bookings) {
                if (booking.date < now) {
                    booking.status = 'завършена';
                    await booking.save();
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                console.log(`✅ Auto-completed ${updatedCount} bookings`);
            }
        } catch (error) {
            console.error('❌ Error in auto-complete job:', error.message);
        }
    });
};