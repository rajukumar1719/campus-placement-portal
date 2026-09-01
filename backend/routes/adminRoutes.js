const express = require('express');
const router = express.Router();

const {
    getStats,
    getAllStudents,
    deleteStudent
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, getStats);

// Get all students
router.get('/students', authMiddleware, adminMiddleware, getAllStudents);

// Delete student
router.delete('/students/:id', authMiddleware, adminMiddleware, deleteStudent);

module.exports = router;