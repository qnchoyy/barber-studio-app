import { BOOKING_STATUS, BOOKING_CONSTANTS } from '../constants/bookingConstants';

/**
 * Парсва booking.date към Date или връща null, ако е невалидна
 * @param {Object} booking
 * @returns {Date|null}
 */
const parseBookingDate = (booking) => {
    const dt = new Date(booking.date);
    return isNaN(dt.getTime()) ? null : dt;
};

/**
 * Връща крайния час на резервацията във формат "HH:mm"
 * @param {Object} booking
 * @returns {string}
 */
export const getBookingEndTime = (booking) => {
    if (!booking?.time || !booking?.serviceId?.duration) {
        return BOOKING_CONSTANTS.UNKNOWN_TIME_TEXT;
    }

    try {
        const [hours, minutes] = booking.time.split(':');
        const baseDate = parseBookingDate(booking) || new Date();
        baseDate.setHours(+hours, +minutes, 0, 0);
        const endTime = new Date(baseDate.getTime() + booking.serviceId.duration * 60000);
        return endTime.toLocaleTimeString(BOOKING_CONSTANTS.DATE_LOCALE, {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.warn('❌ Грешка при изчисляване на крайния час:', error);
        return BOOKING_CONSTANTS.UNKNOWN_TIME_TEXT;
    }
};

/**
 * Форматира ISO дата към "петък, 13 юни 2025"
 * @param {string} isoDateString
 * @returns {string}
 */
export const formatBookingDate = (isoDateString) => {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return BOOKING_CONSTANTS.UNKNOWN_DATE_TEXT;
    return date.toLocaleDateString(BOOKING_CONSTANTS.DATE_LOCALE, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Изчислява оставащо време до резервацията
 * @param {string} isoDateString
 * @returns {string|null}
 */
export const getTimeUntilBooking = (isoDateString) => {
    const bookingDateTime = new Date(isoDateString);
    const now = new Date();
    const diff = bookingDateTime - now;
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
        return `${hours}ч ${minutes}м`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}д ${remainingHours}ч`;
};

/**
 * Проверява дали резервацията може да се отмени
 * @param {Object} booking
 * @returns {boolean}
 */
export const canBeCancelled = (booking) => {
    if (booking?.status !== BOOKING_STATUS.CONFIRMED) return false;
    const dt = parseBookingDate(booking);
    if (!dt) return false;
    const now = new Date();
    return dt - now > BOOKING_CONSTANTS.CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000;
};

/**
 * Проверява дали резервацията е в бъдеще и потвърдена
 * @param {Object} booking
 * @returns {boolean}
 */
export const isBookingUpcoming = (booking) => {
    const dt = parseBookingDate(booking);
    return dt ? dt > new Date() && booking.status === BOOKING_STATUS.CONFIRMED : false;
};

/**
 * Проверява дали резервацията е в миналото
 * @param {Object} booking
 * @returns {boolean}
 */
export const isBookingPast = (booking) => {
    const dt = parseBookingDate(booking);
    return dt ? dt < new Date() : false;
};

/**
 * Връща конфигурация (текст, класове) за даден статус
 * @param {string} status
 * @returns {{ text: string, className: string, gradientClass: string }}
 */
export const getBookingStatusConfig = (status) => {
    const configs = {
        [BOOKING_STATUS.CONFIRMED]: {
            text: 'Потвърдена',
            className: 'bg-green-500/20 text-green-400 border-green-500/30',
            gradientClass: 'bg-gradient-to-br from-green-500 to-green-600',
        },
        [BOOKING_STATUS.COMPLETED]: {
            text: 'Завършена',
            className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            gradientClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
        [BOOKING_STATUS.CANCELLED]: {
            text: 'Отменена',
            className: 'bg-red-500/20 text-red-400 border-red-500/30',
            gradientClass: 'bg-gradient-to-br from-red-500 to-red-600',
        },
    };
    return configs[status] || configs[BOOKING_STATUS.CONFIRMED];
};

/**
 * Връща CSS класове за border на BookingCard
 * @param {Object} booking
 * @returns {string}
 */
export const getBookingCardBorderClass = (booking) => {
    if (isBookingUpcoming(booking)) {
        return 'border-green-500/50 hover:border-green-500/70 shadow-green-500/10';
    }
    if (booking.status === BOOKING_STATUS.CANCELLED) {
        return 'border-red-500/30 hover:border-red-500/50';
    }
    return 'border-gray-700/50 hover:border-blue-500/50';
};
