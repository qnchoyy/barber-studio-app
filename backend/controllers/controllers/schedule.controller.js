import Schedule from "../../models/Schedule.model.js";

export const createSchedule = async (req, res) => {
    try {
        const { day, slots } = req.body;

        if (!day || !slots || !Array.isArray(slots)) {
            return res.status(400).json({
                success: false,
                message: 'Day and valid slots array are required.',
            });
        }

        const existing = await Schedule.findOne({ day });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Schedule for this day already exists.',
            });
        }

        const schedule = new Schedule({ day, slots });
        await schedule.save();

        res.status(201).json({
            success: true,
            message: `Schedule created for ${day}.`,
            data: schedule,
        });
    } catch (error) {
        console.error('Error creating schedule:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while creating schedule.',
        });
    }
};