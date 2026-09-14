const express = require('express');
const router = express.Router();

const {
    createJob, getAllJobs, getSingleJob,
    updateJob, deleteJob, getAdminAllJobs,
    toggleSaveJob, getSavedJobs
} = require('../controllers/jobController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ===== Admin Routes =====
router.get('/admin/all', authMiddleware, adminMiddleware, getAdminAllJobs);

// ===== NEW FEATURE: Saved Jobs (Student) =====
router.get('/saved/my', authMiddleware, getSavedJobs);
router.post('/:id/save', authMiddleware, toggleSaveJob);

// ===== Public Routes =====
router.get('/seed/initial', async (req, res) => {
    try {
        const { autoSeed } = require('../seed');
        const ok = await autoSeed();
        res.status(200).json({ success: ok, message: 'Jobs and Admin seeded successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/', getAllJobs);         // ✅ Public - no auth needed
router.get('/:id', getSingleJob);    // ✅ Public - no auth needed

// ===== Admin Only =====
router.post('/', authMiddleware, adminMiddleware, createJob);
router.put('/:id', authMiddleware, adminMiddleware, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

module.exports = router;