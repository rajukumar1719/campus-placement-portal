const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    uploadResume,
    deleteResume,
    getResume
} = require('../controllers/uploadController');

// ✅ Upload Resume
// POST /api/upload/resume
router.post(
    '/resume',
    authMiddleware,
    upload.single('resume'),
    uploadResume
);

// ✅ Get Resume Info
// GET /api/upload/resume
router.get(
    '/resume',
    authMiddleware,
    getResume
);

// ✅ Delete Resume
// DELETE /api/upload/resume
router.delete(
    '/resume',
    authMiddleware,
    deleteResume
);

module.exports = router;