const express = require('express');
const router = express.Router();

const {
    sendNotification,
    getAllNotifications,
    deleteNotification
} = require('../controllers/notificationController')


const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.get('/', authMiddleware, getAllNotifications)

router.post('/', authMiddleware, adminMiddleware, sendNotification);
router.delete('/', authMiddleware, adminMiddleware, deleteNotification);

module.exports = router;