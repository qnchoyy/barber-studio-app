import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['резервация', 'отмяна', 'система'],
            default: 'резервация',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        relatedBookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        unread: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
