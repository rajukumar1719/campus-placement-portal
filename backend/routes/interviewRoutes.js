const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
    scheduleInterview,
    getAllInterviews,
    getMyInterviews,
    updateInterview,
    deleteInterview,
    getShortlistedApplications
} = require('../controllers/interviewController');

// ===== Student Routes =====
router.get('/my', authMiddleware, getMyInterviews);

// ===== Admin Routes =====
router.get('/shortlisted', authMiddleware, adminMiddleware, getShortlistedApplications);
router.post('/', authMiddleware, adminMiddleware, scheduleInterview);
router.get('/', authMiddleware, adminMiddleware, getAllInterviews);
router.put('/:id', authMiddleware, adminMiddleware, updateInterview);
router.delete('/:id', authMiddleware, adminMiddleware, deleteInterview);

module.exports = router;