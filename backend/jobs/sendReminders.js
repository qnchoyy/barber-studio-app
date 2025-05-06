import cron from 'node-cron';
import Booking from '../models/Booking.model.js';
import { sendSMS } from '../utils/sendSMS.js';


export const sendBookingReminders = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const now = new Date();
            const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

            const startWindow = new Date(threeHoursLater);
            startWindow.setMinutes(0, 0, 0);

            const endWindow = new Date(threeHoursLater);
            endWindow.setMinutes(59, 59, 999);

            const bookings = await Booking.find({
                status: 'потвърдена',
                reminderSent: { $ne: true },
                date: {
                    $gte: startWindow,
                    $lte: endWindow
                }
            });

            for (let booking of bookings) {
                const msg = `Напомняне: Имате резервация в ${booking.time} ч. днес. Очакваме Ви! ✂️`;

                const result = await sendSMS(booking.phone, msg);

                if (result.success) {
                    await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
                    console.log(`📩 Напомняне изпратено до ${booking.userName} за ${booking.time}`);
                } else {
                    console.error(`❌ Неуспешно напомняне за ${booking.phone}: ${result.error}`);
                }
            }

        } catch (error) {
            console.error('❌ Reminder job error:', error.message);
        }
    });
};