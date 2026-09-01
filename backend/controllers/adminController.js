const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ✅ FIX: Added all stats calculations
exports.getStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // ✅ NEW: Application status counts
        const pendingApplications = await Application.countDocuments({
            status: { $in: ['applied', 'pending'] }
        });

        const shortlistedApplications = await Application.countDocuments({
            status: 'shortlisted'
        });

        const rejectedApplications = await Application.countDocuments({
            status: 'rejected'
        });

        const selectedApplications = await Application.countDocuments({
            status: 'selected'
        });

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalJobs,
                totalApplications,
                pendingApplications,       // ✅ NEW
                shortlistedApplications,   // ✅ NEW
                rejectedApplications,      // ✅ NEW
                selectedApplications       // ✅ NEW
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getAllStudents = async (req, res) => {
    try {
        const { search } = req.query;

        let query = { role: 'student' };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const students = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin'
            });
        }

        // Delete student's applications first
        await Application.deleteMany({ student: student._id });

        // Then delete student
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};