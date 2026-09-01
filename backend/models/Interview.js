const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({

    // Konsi application ke liye
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    // Konse student ka
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Konsi job ke liye
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    // Interview Details
    interviewDate: {
        type: Date,
        required: [true, 'Interview date is required']
    },
    interviewTime: {
        type: String,
        required: [true, 'Interview time is required']
    },
    interviewType: {
        type: String,
        enum: ['Online', 'Offline', 'Telephonic'],
        default: 'Online'
    },
    venue: {
        type: String,
        default: ''
    },
    meetingLink: {
        type: String,
        default: ''
    },
    round: {
        type: String,
        default: 'Round 1'
    },
    instructions: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'postponed'],
        default: 'scheduled'
    },
    // Admin notes
    adminNotes: {
        type: String,
        default: ''
    },
    // Scheduled by admin
    scheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
interviewSchema.index({ student: 1, status: 1 });
interviewSchema.index({ job: 1 });
interviewSchema.index({ interviewDate: 1 });

module.exports = mongoose.model('Interview', interviewSchema);