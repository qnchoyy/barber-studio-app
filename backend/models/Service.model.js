import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ['Подстригване', 'Оформяне на брада', 'Пакет: Подстригване + Оформяне на брада'],
            required: [true, 'Service name is required'],
            trim: true
        },
        duration: {
            type: Number,
            required: [true, 'Service duration is required']
        },
        price: {
            type: Number,
            required: [true, 'Service price is required']
        }
    },
    {
        timestamps: true
    }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
