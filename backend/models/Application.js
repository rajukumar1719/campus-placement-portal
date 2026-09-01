const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Konse student ne apply kia
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Konsi job ke liye apply kia
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    // ✅ FIX: Application status - sab statuses add kiye
    status: {
        type: String,
        enum: ['applied', 'pending', 'shortlisted', 'rejected', 'selected'],
        default: 'applied'
    },
    
    // ✅ NEW: Admin remarks field
    adminRemarks: {
        type: String,
        default: ''
    },
    
    whyApply: {
        type: String,
        default: ''
    },
   
    additionalInfo: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// ✅ Index for faster queries
applicationSchema.index({ student: 1, job: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);