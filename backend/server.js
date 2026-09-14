const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB().then(async () => {
    try {
        const { autoSeed } = require('./seed');
        await autoSeed();
    } catch (e) {
        console.error('Auto-seed error on startup:', e.message);
    }
});

const app = express();
app.set('trust proxy', 1);

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ CORS Configuration
const allowedOrigins = [
    process.env.Frontend_URI,
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://campus-placement-portal-murex.vercel.app'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.includes(cleanOrigin) ||
                          /\.vercel\.app$/.test(cleanOrigin) ||
                          cleanOrigin.startsWith('http://localhost:');

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// ✅ Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many attempts. Try again after 15 minutes.'
    },
    skip: (req) => process.env.NODE_ENV === 'development'
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    }
});

// ✅ Auth Limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// ✅ API Limiters
app.use('/api/profile', apiLimiter);
app.use('/api/jobs', apiLimiter);
app.use('/api/applications', apiLimiter);
app.use('/api/notifications', apiLimiter);
app.use('/api/admin', apiLimiter);
app.use('/api/upload', apiLimiter);
app.use('/api/analytics', apiLimiter);
app.use('/api/interviews', apiLimiter); // ✅ Added

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes')); // ✅ Added

// ✅ Health Check
app.get('/health', (req, res) => {
    const dbState = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    res.status(200).json({
        success: true,
        status: 'Server is running',
        database: dbState[require('mongoose').connection.readyState],
        timestamp: new Date().toISOString()
    });
});

// ✅ 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum 5MB allowed.'
        });
    }

    if (err.message === 'Only PDF files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only PDF files are allowed!'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ✅ Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server Error:', err);
});

module.exports = server;