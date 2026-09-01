const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },

    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },

    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);