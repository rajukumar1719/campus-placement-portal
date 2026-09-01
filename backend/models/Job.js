const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    jobType: {
        type: String,
        enum: ['Full Time', 'Internship', 'Contract', 'Part Time'],
        default: 'Full Time'
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    salary: {
        type: String,
        required: [true, 'Salary/Package is required']
    },
    eligibility: {
        type: String,
        required: [true, 'Eligibility is required']
    },
    minCGPA: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required']
    },
    applyLink: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    // Konse admin ne post kia
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);