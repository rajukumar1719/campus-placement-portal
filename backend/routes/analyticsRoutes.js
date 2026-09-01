const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
    getOverviewStats,
    getBranchAnalytics,
    getCompanyAnalytics,
    getMonthlyAnalytics,
    getCgpaDistribution
} = require('../controllers/analyticsController');

// All routes admin only
router.get('/overview', authMiddleware, adminMiddleware, getOverviewStats);
router.get('/branches', authMiddleware, adminMiddleware, getBranchAnalytics);
router.get('/companies', authMiddleware, adminMiddleware, getCompanyAnalytics);
router.get('/monthly', authMiddleware, adminMiddleware, getMonthlyAnalytics);
router.get('/cgpa', authMiddleware, adminMiddleware, getCgpaDistribution);

module.exports = router;