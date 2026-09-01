const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ FIX: Sanitized updateProfile
exports.updateProfile = async (req, res) => {
    try {
        const {
            name, phone, dateOfBirth, gender, branch,
            semester, cgpa, batch, collegeName, address,
            skills, percentage10th, percentage12th, resume,
            profilePhoto
        } = req.body;

        // ✅ WHITELIST: Only these fields allowed
        const allowedFields = [
            'name', 'phone', 'dateOfBirth', 'gender', 'branch',
            'semester', 'cgpa', 'batch', 'collegeName', 'address',
            'skills', 'percentage10th', 'percentage12th', 'resume',
            'profilePhoto'
        ];

        const updateData = {};

        // ✅ Only update whitelisted fields
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // ✅ Additional validation
        if (cgpa !== undefined) {
            if (cgpa < 0 || cgpa > 10) {
                return res.status(400).json({
                    success: false,
                    message: 'CGPA must be between 0 and 10'
                });
            }
        }

        if (phone !== undefined) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be 10 digits'
                });
            }
        }

        // ✅ Check if profile is complete
        const user = await User.findById(req.user._id);
        const checkName = name || user.name;
        const checkPhone = phone || user.phone;
        const checkBranch = branch || user.branch;
        const checkCgpa = cgpa !== undefined ? cgpa : user.cgpa;
        const checkBatch = batch || user.batch;
        const checkCollege = collegeName || user.collegeName;

        if (checkName && checkPhone && checkCgpa && checkBranch && checkBatch && checkCollege) {
            updateData.profileComplete = true;
        }

        // ✅ User update
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};