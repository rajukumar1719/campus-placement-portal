const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    gender: { type: String, default: '' },
    branch: { type: String, default: '' },
    semester: { type: String, default: '' },
    cgpa: { type: Number, default: 0 },
    batch: { type: String, default: '' },
    collegeName: { type: String, default: '' },
    address: { type: String, default: '' },
    skills: { type: String, default: '' },
    percentage10th: { type: Number, default: 0 },
    percentage12th: { type: Number, default: 0 },
    resume: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    profileComplete: { type: Boolean, default: false },

    // ✅ NEW FEATURE: Saved/Bookmarked Jobs
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],

    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpire: {
        type: Date,
        default: undefined
    }
}, {
    timestamps: true
});

// ✅ FIXED: Password Hash Middleware
// ✅ YAHI LAGAO
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// ✅ Compare Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate Reset Token
userSchema.methods.generateResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);