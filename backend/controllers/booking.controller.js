import dayjs from 'dayjs';
import mongoose from 'mongoose';

import Booking from '../models/Booking.model.js';
import Schedule from '../models/Schedule.model.js';
import Service from '../models/Service.model.js';

import { sendSMS } from '../utils/sendSMS.js';
import { formatToE164, validateBulgarianPhone } from '../utils/phoneUtils.js';

export const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userName, phone, serviceId, date, time } = req.body;
        if (!userName || !phone || !serviceId || !date || !time) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (!validateBulgarianPhone(phone)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Невалиден телефонен номер. Използвайте формат: 0888123456'
            });
        }

        const normalizedPhone = formatToE164(phone);

        const service = await Service.findById(serviceId).session(session);
        if (!service) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }

        const fullDate = new Date(`${date}T${time}`);
        const dayOfWeek = fullDate.toLocaleDateString('bg-BG', { weekday: 'long' });
        const schedule = await Schedule.findOne({ day: dayOfWeek }).session(session);

        if (!schedule || !schedule.slots.includes(time)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: `The time ${time} is not available on ${dayOfWeek}.` });
        }

        const bookingStart = dayjs(fullDate);
        const bookingEnd = bookingStart.add(service.duration, 'minute');

        const sameDayStart = bookingStart.startOf('day').toDate();
        const sameDayEnd = bookingStart.endOf('day').toDate();

        const bookingsForDay = await Booking.find({
            date: { $gte: sameDayStart, $lte: sameDayEnd },
            status: { $ne: 'отменена' }
        }).populate('serviceId').session(session);

        for (let existing of bookingsForDay) {
            const existingStart = dayjs(existing.date);
            const existingEnd = existingStart.add(existing.serviceId.duration, 'minute');
            const overlap = bookingStart.isBefore(existingEnd) && bookingEnd.isAfter(existingStart);
            if (overlap) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: 'This time overlaps with another booking.' });
            }
        }

        const [booking] = await Booking.create([
            {
                userId: req.user._id,
                userName,
                phone: normalizedPhone,
                serviceId,
                date: fullDate,
                time,
            }
        ], { session });

        await session.commitTransaction();
        session.endSession();

        const result = await sendSMS(
            normalizedPhone,
            `Здравей, ${userName}! Успешно направи резервация за ${service.name} на ${date} в ${time}.`
        );
        if (!result.success) {
            console.error('SMS error:', result.error);
        }

        return res.status(201).json({ success: true, message: 'Booking created successfully.', data: booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating booking with transaction:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the booking.' });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const statusFilter = req.query.status;
        const sortOrder = req.query.sort === 'asc' ? 1 : -1;

        const query = {};
        if (statusFilter) {
            query.status = statusFilter;
        }

        const total = await Booking.countDocuments(query);
        const pages = Math.ceil(total / limit);

        const bookings = await Booking.find(query)
            .sort({ date: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate('serviceId', 'name price duration');

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: pages,
            totalBookings: total,
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
        const { date, serviceId } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date query is required (e.g. ?date=2025-06-04)',
            });
        }

        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: 'Service ID is required',
            });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        const serviceDuration = service.duration;

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

        const sameDayStart = dayjs(bookingDate).startOf('day').toDate();
        const sameDayEnd = dayjs(bookingDate).endOf('day').toDate();

        const bookings = await Booking.find({
            date: { $gte: sameDayStart, $lte: sameDayEnd },
            status: { $ne: 'отменена' }
        }).populate('serviceId');

        const availableSlots = [];

        for (const slot of schedule.slots) {
            const proposedStart = dayjs(`${date}T${slot}`);
            const proposedEnd = proposedStart.add(serviceDuration, 'minute');

            const lastSlot = schedule.slots[schedule.slots.length - 1];
            const workEnd = dayjs(`${date}T${lastSlot}`).add(60, 'minute');

            if (proposedEnd.isAfter(workEnd)) {
                continue;
            }

            let hasConflict = false;

            for (const booking of bookings) {
                const bookingStart = dayjs(booking.date);
                const bookingEnd = bookingStart.add(booking.serviceId.duration, 'minute');

                if (proposedStart.isBefore(bookingEnd) && proposedEnd.isAfter(bookingStart)) {
                    hasConflict = true;
                    break;
                }
            }

            if (!hasConflict) {
                availableSlots.push(slot);
            }
        }

        res.status(200).json({
            success: true,
            date,
            weekday: dayName,
            availableSlots,
            serviceDuration,
            algorithm: 'intelligent-overlap-check'
        });

    } catch (error) {
        console.error('Error fetching available slots:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching available slots.',
        });
    }
};

export const cancelMyBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Резервацията не е намерена.',
            });
        }

        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Нямате права да отмените тази резервация.',
            });
        }

        if (booking.status !== 'потвърдена') {
            return res.status(400).json({
                success: false,
                message: `Не можете да отмените резервация със статус "${booking.status}".`,
            });
        }

        const bookingDateTime = new Date(booking.date);
        const now = new Date();
        const timeDifference = bookingDateTime - now;
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        if (timeDifference < twoHoursInMs && timeDifference > 0) {
            return res.status(400).json({
                success: false,
                message: 'Не можете да отмените резервация по-малко от 2 часа преди часа.',
            });
        }

        if (timeDifference < 0) {
            return res.status(400).json({
                success: false,
                message: 'Не можете да отмените резервация която вече е минала.',
            });
        }

        booking.status = 'отменена';
        await booking.save();

        const cancelSMS = `Здравей, ${booking.userName}! Вашата резервация за ${booking.date.toLocaleDateString('bg-BG')} в ${booking.time} е отменена успешно.`;

        try {
            await sendSMS(booking.phone, cancelSMS);
        } catch (smsError) {
            console.error('SMS error during cancellation:', smsError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Резервацията е отменена успешно.',
            data: booking,
        });

    } catch (error) {
        console.error('Error cancelling booking:', error.message);
        res.status(500).json({
            success: false,
            message: 'Възникна грешка при отмяна на резервацията.',
        });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const totalRevenuePipeline = [
            { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
            { $unwind: '$service' },
            { $match: { status: 'завършена' } },
            { $group: { _id: null, total: { $sum: '$service.price' } } }
        ];

        const monthlyRevenuePipeline = [
            { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
            { $unwind: '$service' },
            {
                $match: {
                    status: 'завършена',
                    createdAt: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$service.price' } } }
        ];

        const statusStatsPipeline = [
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ];

        const topServicesPipeline = [
            { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
            { $unwind: '$service' },
            {
                $group: {
                    _id: '$service.name',
                    count: { $sum: 1 },
                    revenue: { $sum: '$service.price' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ];

        const bookingTrendsPipeline = [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } },
            { $project: { date: '$_id', count: 1, _id: 0 } }
        ];

        const [
            totalBookings,
            monthlyBookings,
            weeklyBookings,
            totalRevenueResult,
            monthlyRevenueResult,
            activeUsersList,
            totalServices,
            statusStats,
            topServices,
            bookingTrends
        ] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Booking.aggregate(totalRevenuePipeline),
            Booking.aggregate(monthlyRevenuePipeline),
            Booking.distinct('userId'),
            Service.countDocuments(),
            Booking.aggregate(statusStatsPipeline),
            Booking.aggregate(topServicesPipeline),
            Booking.aggregate(bookingTrendsPipeline)
        ]);

        const totalRevenue = totalRevenueResult[0]?.total || 0;
        const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;
        const activeUsers = activeUsersList.length;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalBookings,
                    monthlyBookings,
                    weeklyBookings,
                    totalRevenue,
                    monthlyRevenue,
                    activeUsers,
                    totalServices
                },
                statusStats,
                topServices,
                bookingTrends
            }
        });
    } catch (error) {
        console.error('Грешка при извличане на статистики:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на статистики'
        });
    }
};

export const getRecentBookings = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const totalItems = await Booking.countDocuments();

        const recentBookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('serviceId', 'name price duration')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('userName phone date time status userId serviceId createdAt')
            .lean();

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            data: recentBookings,
            pagination: { currentPage: page, totalPages, totalItems, limit }
        });

    } catch (error) {
        console.error('Грешка при извличане на последни резервации:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на резервации'
        });
    }
};

export const getPendingBookings = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const totalItems = await Booking.countDocuments({
            status: 'потвърдена'
        });

        const pendingBookings = await Booking.find({
            status: 'потвърдена'
        })
            .populate('userId', 'name email phone')
            .populate('serviceId', 'name price duration')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('userName phone date time status userId serviceId createdAt')
            .lean();

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            data: pendingBookings,
            pagination: { currentPage: page, totalPages, totalItems, limit }
        });

    } catch (error) {
        console.error('Грешка при извличане на pending резервации:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на резервации'
        });
    }
};

export const getMonthlyRevenue = async (req, res) => {
    try {
        const monthlyData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth();

            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

            const revenueResult = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'services',
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'service'
                    }
                },
                { $unwind: '$service' },
                {
                    $match: {
                        status: 'завършена',
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$service.price' },
                        count: { $sum: 1 }
                    }
                }
            ]);
            const monthNames = [
                'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Юни',
                'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'
            ];

            monthlyData.push({
                month: monthNames[month],
                revenue: revenueResult[0]?.revenue || 0,
                bookings: revenueResult[0]?.count || 0
            });
        }

        res.status(200).json({
            success: true,
            data: monthlyData
        });

    } catch (error) {
        console.error('Грешка при извличане на месечни приходи:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на данни'
        });
    }
};