const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    signup,
    login,
    logout,
    getme,
    forgotPassword,   // ✅ NEW
    resetPassword      // ✅ NEW
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getme);
router.post('/forgot-password', forgotPassword);      
router.post('/reset-password/:token', resetPassword);  

module.exports = router;