// controllers/analyticsController.js
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
// ✅ REMOVED: Interview model (doesn't exist)

// ✅ Overview Stats
exports.getOverviewStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const closedJobs = await Job.countDocuments({ status: 'closed' });
        const totalApplications = await Application.countDocuments();

        const appliedCount = await Application.countDocuments({ 
            status: { $in: ['applied', 'pending'] } 
        });
        const shortlistedCount = await Application.countDocuments({ 
            status: 'shortlisted' 
        });
        const selectedCount = await Application.countDocuments({ 
            status: 'selected' 
        });
        const rejectedCount = await Application.countDocuments({ 
            status: 'rejected' 
        });

        const profileComplete = await User.countDocuments({ 
            role: 'student', 
            profileComplete: true 
        });
        const profileIncomplete = totalStudents - profileComplete;

        res.status(200).json({
            success: true,
            overview: {
                totalStudents,
                totalJobs,
                activeJobs,
                closedJobs,
                totalApplications,
                appliedCount,
                shortlistedCount,
                selectedCount,
                rejectedCount,
                profileComplete,
                profileIncomplete
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Branch Analytics
exports.getBranchAnalytics = async (req, res) => {
    try {
        const branchData = await User.aggregate([
            { $match: { role: 'student', branch: { $ne: null, $ne: '' } } },
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const branchPlacements = await Application.aggregate([
            { $match: { status: 'selected' } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentData'
                }
            },
            { $unwind: '$studentData' },
            { $group: { _id: '$studentData.branch', placed: { $sum: 1 } } },
            { $sort: { placed: -1 } }
        ]);

        const branches = branchData.map(b => {
            const placement = branchPlacements.find(p => p._id === b._id);
            return {
                branch: b._id,
                totalStudents: b.count,
                placed: placement ? placement.placed : 0
            };
        });

        res.status(200).json({
            success: true,
            branches
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Company Analytics
exports.getCompanyAnalytics = async (req, res) => {
    try {
        const companyData = await Application.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobData'
                }
            },
            { $unwind: '$jobData' },
            {
                $group: {
                    _id: '$jobData.companyName',
                    totalApplications: { $sum: 1 },
                    shortlisted: {
                        $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] }
                    },
                    selected: {
                        $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                    }
                }
            },
            { $sort: { totalApplications: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            companies: companyData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Monthly Analytics
exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyApplications = await Application.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: 1 },
                    selected: {
                        $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthlyRegistrations = await User.aggregate([
            { $match: { role: 'student', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthlyJobs = await Job.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        const formatData = (data) => {
            return data.map(item => ({
                month: monthNames[item._id.month - 1],
                year: item._id.year,
                label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
                ...item
            }));
        };

        res.status(200).json({
            success: true,
            monthly: {
                applications: formatData(monthlyApplications),
                registrations: formatData(monthlyRegistrations),
                jobs: formatData(monthlyJobs)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ CGPA Distribution
exports.getCgpaDistribution = async (req, res) => {
    try {
        const cgpaRanges = [
            { label: '9.0 - 10.0', min: 9.0, max: 10.0 },
            { label: '8.0 - 8.9', min: 8.0, max: 8.99 },
            { label: '7.0 - 7.9', min: 7.0, max: 7.99 },
            { label: '6.0 - 6.9', min: 6.0, max: 6.99 },
            { label: '5.0 - 5.9', min: 5.0, max: 5.99 },
            { label: 'Below 5.0', min: 0, max: 4.99 }
        ];

        const distribution = await Promise.all(
            cgpaRanges.map(async (range) => {
                const count = await User.countDocuments({
                    role: 'student',
                    cgpa: { $gte: range.min, $lte: range.max }
                });
                return { ...range, count };
            })
        );

        res.status(200).json({
            success: true,
            distribution
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; // ✅ Only ONE closing }; here - removed extra one