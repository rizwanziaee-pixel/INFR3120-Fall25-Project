// config/multer.js
// MEMBER 1: File upload configuration for profile pictures

const multer = require('multer');
const path = require('path');

// Configure where and how to store uploaded files
const storage = multer.diskStorage({
    // Destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
        // IMPORTANT: Make sure this folder exists!
    },
    
    // Generate unique filename for each upload
    filename: function (req, file, cb) {
        // Format: profile-1234567890-random.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File validation: Accept only image files
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    
    // Check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept file
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
};

// Create the multer upload instance
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB maximum file size
    },
    fileFilter: fileFilter
});

module.exports = upload;