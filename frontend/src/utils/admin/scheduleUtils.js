export const WEEK_DAYS = [
    'понеделник',
    'вторник',
    'сряда',
    'четвъртък',
    'петък',
    'събота',
    'неделя'
];

/**
 * Генерира стандартни часове за работен ден
 * @param {string} startTime - Начален час (напр. "09:00")
 * @param {string} endTime - Краен час (напр. "18:00") 
 * @param {number} interval - Интервал в минути (напр. 30)
 * @returns {Array<string>} Масив от часове
 */
export const generateStandardSlots = (startTime = '09:00', endTime = '18:00', interval = 30) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        slots.push(timeString);

        currentMinute += interval;
        if (currentMinute >= 60) {
            currentHour++;
            currentMinute = 0;
        }
    }

    return slots;
};

/**
 * Сортира часовете в хронологичен ред
 * @param {Array<string>} slots - Несортирани часове
 * @returns {Array<string>} Сортирани часове
 */
export const sortSlots = (slots) => {
    return [...slots].sort((a, b) => {
        const [aHour, aMinute] = a.split(':').map(Number);
        const [bHour, bMinute] = b.split(':').map(Number);
        return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
    });
};

/**
 * Валидира дали часът е в правилен формат
 * @param {string} timeSlot - Час за валидиране (напр. "10:30")
 * @returns {boolean}
 */
export const validateTimeSlot = (timeSlot) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeSlot);
};

/**
 * Получава график за конкретен ден
 * @param {Array} schedules - Масив от графици
 * @param {string} day - Ден от седмицата
 * @returns {Object|null} График или null
 */
export const getScheduleForDay = (schedules, day) => {
    return schedules.find(schedule => schedule.day === day) || null;
};

/**
 * Проверява дали денят е работен
 * @param {Array} schedules - Масив от графици
 * @param {string} day - Ден от седмицата  
 * @returns {boolean}
 */
export const isWorkingDay = (schedules, day) => {
    const schedule = getScheduleForDay(schedules, day);
    return schedule && schedule.slots.length > 0;
};

/**
 * Форматира графиците за показване в UI
 * @param {Array} schedules - Масив от графици
 * @returns {Array} Форматирани графици
 */
export const getFormattedSchedules = (schedules) => {
    return WEEK_DAYS.map(day => {
        const schedule = getScheduleForDay(schedules, day);
        return {
            day,
            dayBg: day.charAt(0).toUpperCase() + day.slice(1), // Понеделник
            isWorking: isWorkingDay(schedules, day),
            slots: schedule ? sortSlots(schedule.slots) : [],
            slotsCount: schedule ? schedule.slots.length : 0
        };
    });
};
