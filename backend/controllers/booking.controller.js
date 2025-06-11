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

// ==================== ADMIN STATISTICS FUNCTIONS ====================

// Общи статистики за админ dashboard
export const getAdminStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        // Общо резервации
        const totalBookings = await Booking.countDocuments();
        const monthlyBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfMonth }
        });
        const weeklyBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        // Общи приходи (само потвърдени и завършени)
        const totalRevenueResult = await Booking.aggregate([
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            { $unwind: '$service' },
            { $match: { status: { $in: ['потвърдена', 'завършена'] } } },
            { $group: { _id: null, total: { $sum: '$service.price' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        const monthlyRevenueResult = await Booking.aggregate([
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
                    status: { $in: ['потвърдена', 'завършена'] },
                    createdAt: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$service.price' } } }
        ]);
        const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

        // Брой активни потребители (потребители с поне 1 резервация)
        const activeUsers = await Booking.distinct('userId').then(users => users.length);

        // Брой услуги
        const totalServices = await Service.countDocuments();

        // Статистики по статус
        const statusStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Топ услуги по популярност
        const topServices = await Booking.aggregate([
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
                $group: {
                    _id: '$service.name',
                    count: { $sum: 1 },
                    revenue: { $sum: '$service.price' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Резервации по дни (последните 7 дни)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await Booking.countDocuments({
                createdAt: {
                    $gte: date,
                    $lt: nextDate
                }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                count
            });
        }

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
                bookingTrends: last7Days
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

// Последни резервации за dashboard
export const getRecentBookings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const recentBookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('serviceId', 'name price duration')
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('userName date time status userId serviceId createdAt');

        res.status(200).json({
            success: true,
            data: recentBookings
        });

    } catch (error) {
        console.error('Грешка при извличане на последни резервации:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на резервации'
        });
    }
};

// Pending резервации (нови/неодобрени)
export const getPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({
            status: { $in: ['нова', 'чакаща потвърждение', 'потвърдена'] }
        })
            .populate('userId', 'name email phone')
            .populate('serviceId', 'name price duration')
            .sort({ createdAt: -1 })
            .select('userName date time status userId serviceId createdAt');

        res.status(200).json({
            success: true,
            data: pendingBookings
        });

    } catch (error) {
        console.error('Грешка при извличане на pending резервации:', error);
        res.status(500).json({
            success: false,
            message: 'Грешка при извличане на резервации'
        });
    }
};

// Месечни приходи за графика (последните 6 месеца)
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
                        status: { $in: ['потвърдена', 'завършена'] },
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