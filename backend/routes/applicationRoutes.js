const express = require('express');
const router = express.Router();

const { applyForJob, getMyApplications, getAllApplications, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Student routes
router.post('/', authMiddleware, applyForJob);
router.get('/my', authMiddleware, getMyApplications);
router.delete('/:id/withdraw', authMiddleware, withdrawApplication);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllApplications);
router.put('/:id', authMiddleware, adminMiddleware, updateApplicationStatus);

module.exports = router;