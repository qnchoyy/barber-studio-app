import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: [true, 'Service ID is required'],
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        status: {
            type: String,
            enum: ['потвърдена', 'завършена', 'отменена'],
            default: 'потвърдена',
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;