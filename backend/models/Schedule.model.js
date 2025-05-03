import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота', 'неделя'],
        required: true,
        unique: true,
    },
    slots: {
        type: [String],
        default: [],
    },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;