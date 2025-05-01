import Booking from '../models/Booking.model.js';
import Service from '../models/Service.model.js';

export const createBooking = async (req, res) => {
    try {
        const { userName, phone, serviceId, date, time } = req.body;

        if (!userName || !phone || !serviceId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked. Please choose another time.',
            });
        }

        const booking = new Booking({
            userId: req.user._id,
            userName,
            phone,
            serviceId,
            date: fullDate,
            time,
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully.',
            data: booking,
        });

    } catch (error) {
        console.error('Error creating booking:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the booking.',
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('serviceId', 'name price duration');

        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully.',
            data: bookings,
        });

    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the bookings.',
        });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('serviceId');

        res.status(200).json({
            success: true,
            message: 'User bookings fetched successfully.',
            data: bookings,
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching bookings.',
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['завършена', 'отменена'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed: "завършена", "отменена".',
            });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        if (booking.status !== 'потвърдена') {
            return res.status(400).json({
                success: false,
                message: 'Only bookings with status "потвърдена" can be updated.',
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            message: `Booking status updated to "${status}".`,
            data: booking,
        });

    } catch (error) {
        console.error('Error updating booking status:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while updating booking status.',
        });
    }
};