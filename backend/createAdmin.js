require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
    await connectDB();

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
        console.log(`Admin already exists: ${existing.name} (${existing.email})`);
        process.exit(0);
    }

    const admin = await User.create({
        name: 'Admin',
        email: 'admin@campushire.com',
        password: 'Admin@123',   // baad me login ke baad change kar lena
        role: 'admin'
    });

    console.log(`✅ Admin created: ${admin.email} / password: Admin@123`);
    process.exit(0);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});