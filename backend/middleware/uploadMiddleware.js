const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Upload folder create karo agar nahi hai
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created:', uploadDir);
}

// ✅ Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: userId_timestamp.pdf
        const uniqueName = `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// ✅ File Filter - Sirf PDF allow karo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
        cb(null, true); // ✅ Allow
    } else {
        cb(new Error('Only PDF files are allowed!'), false); // ❌ Reject
    }
};

// ✅ Multer Upload Config
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;