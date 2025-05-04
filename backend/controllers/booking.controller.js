import Booking from '../models/Booking.model.js';
import Schedule from '../models/Schedule.model.js';
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

        const fullDate = new Date(`${date}T${time}`);
        const dayOfWeek = fullDate.toLocaleDateString('bg-BG', { weekday: 'long' });

        const schedule = await Schedule.findOne({ day: dayOfWeek });
        if (!schedule) {
            return res.status(400).json({
                success: false,
                message: `No working schedule for ${dayOfWeek}.`,
            });
        }

        if (!schedule.slots.includes(time)) {
            return res.status(400).json({
                success: false,
                message: `The time ${time} is not available on ${dayOfWeek}.`,
            });
        }

        const existingBooking = await Booking.findOne({ date: fullDate });
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked.',
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

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id).populate('serviceId', 'name price duration');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking fetched successfully.',
            data: booking,
        });

    } catch (error) {
        console.error('Error fetching booking by ID:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching booking.',
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully.',
            data: booking,
        });
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting booking.',
        });
    }
};

export const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date query is required (e.g. ?date=2025-05-10)',
            });
        }

        const bookingDate = new Date(date);
        const dayName = bookingDate.toLocaleDateString('bg-BG', { weekday: 'long' });

        const schedule = await Schedule.findOne({ day: dayName });
        if (!schedule || schedule.slots.length === 0) {
            return res.status(200).json({
                success: true,
                date,
                weekday: dayName,
                availableSlots: [],
                message: 'No available slots – day off or not configured.',
            });
        }

        const bookings = await Booking.find({ date: bookingDate });
        const bookedTimes = bookings.map(b => b.time);

        const availableSlots = schedule.slots.filter(slot => !bookedTimes.includes(slot));

        res.status(200).json({
            success: true,
            date,
            weekday: dayName,
            availableSlots,
        });

    } catch (error) {
        console.error('Error fetching available slots:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching available slots.',
        });
    }
};
