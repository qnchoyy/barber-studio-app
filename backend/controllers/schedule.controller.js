import Schedule from "../models/Schedule.model.js";

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

export const updateSchedule = async (req, res) => {
  try {
    const { day } = req.params;
    const { slots } = req.body;

    if (!slots || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'A valid array of slots is required.',
      });
    }

    const schedule = await Schedule.findOne({ day });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `No schedule found for ${day}.`,
      });
    }

    schedule.slots = slots;
    await schedule.save();

    res.status(200).json({
      success: true,
      message: `Schedule for ${day} updated successfully.`,
      data: schedule,
    });
  } catch (error) {
    console.error('Error updating schedule:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating schedule.',
    });
  }
};

export const getScheduleByDay = async (req, res) => {
  try {
    const { day } = req.params;

    const schedule = await Schedule.findOne({ day });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `No schedule found for ${day}.`,
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedule.',
    });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ day: 1 });

    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error('Error fetching all schedules:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedules.',
    });
  }
};

export const deleteScheduleByDay = async (req, res) => {
  try {
    const { day } = req.params;

    const schedule = await Schedule.findOneAndDelete({ day });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `No schedule found for ${day}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Schedule for ${day} deleted.`,
    });
  } catch (error) {
    console.error('Error deleting schedule:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting schedule.',
    });
  }
};