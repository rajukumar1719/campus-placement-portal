// controllers/notificationController.js
const Notification = require('../models/Notification');

// ✅ Send Notification (Admin)
exports.sendNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and message'
            });
        }

        const notification = await Notification.create({
            title,
            message,
            sentBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Notification sent successfully',
            notification: notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Get All Notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('sentBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications: notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Delete Notification (Admin)
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};