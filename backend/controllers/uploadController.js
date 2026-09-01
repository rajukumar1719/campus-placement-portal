const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// ✅ Upload Resume
exports.uploadResume = async (req, res) => {
    try {
        // File upload hua ya nahi check
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select a PDF file to upload'
            });
        }

        // File URL banao
        const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;

        // ✅ Purana resume delete karo (if exists)
        const user = await User.findById(req.user._id);

        if (user.resume) {
            // Purani file ka path nikalo
            const oldFilename = user.resume.split('/uploads/resumes/')[1];
            if (oldFilename) {
                const oldFilePath = path.join(__dirname, '..', 'uploads', 'resumes', oldFilename);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log('✅ Old resume deleted:', oldFilename);
                }
            }
        }

        // ✅ Database update karo
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { resume: resumeUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully!',
            resumeUrl: resumeUrl,
            user: updatedUser
        });

    } catch (error) {
        // ✅ Error pe uploaded file delete karo
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', 'resumes', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Delete Resume
exports.deleteResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.resume) {
            return res.status(400).json({
                success: false,
                message: 'No resume found to delete'
            });
        }

        // File delete karo
        const filename = user.resume.split('/uploads/resumes/')[1];
        if (filename) {
            const filePath = path.join(__dirname, '..', 'uploads', 'resumes', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Database update karo
        await User.findByIdAndUpdate(
            req.user._id,
            { resume: '' },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Get Resume
exports.getResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('resume name');

        res.status(200).json({
            success: true,
            resume: user.resume || null,
            name: user.name
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};