import Service from "../models/Service.model.js";

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();

        res.status(200).json({
            success: true,
            message: 'Services fetched successfully.',
            data: services
        });

    } catch (error) {
        console.error('Error fetching services:', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching services.'
        });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, duration, price } = req.body;

        const existingService = await Service.findOne({ name });
        if (existingService) {
            return res.status(400).json({
                success: false,
                message: 'Service already exists.'
            });
        }

        const service = new Service({ name, duration, price });
        await service.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully.',
            data: service
        });

    } catch (error) {
        console.error('Error creating service:', error.message);

        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the service.'
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        if (name) service.name = name;
        if (price) service.price = price;
        if (duration) service.duration = duration;

        await service.save();

        res.status(200).json({
            success: true,
            message: 'Service updated successfully.',
            data: service,
        });
    } catch (error) {
        console.error('Error updating service:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while updating service.',
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully.',
            data: service,
        });
    } catch (error) {
        console.error('Error deleting service:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting service.',
        });
    }
};