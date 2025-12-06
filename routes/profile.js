// routes/profile.js
// MEMBER 1: All profile-related routes

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const requireLogin = require('../middleware/requireLogin');
const upload = require('../config/multer');

// ========================================
// PROFILE ROUTES
// All routes require user to be logged in
// ========================================

/**
 * GET /profile
 * View user profile page
 */
router.get('/profile', requireLogin, profileController.viewProfile);

/**
 * GET /profile/edit
 * Show edit profile form
 */
router.get('/profile/edit', requireLogin, profileController.editProfileForm);

/**
 * POST /profile/edit
 * Update user profile (username, email)
 */
router.post('/profile/edit', requireLogin, profileController.updateProfile);

/**
 * POST /profile/upload
 * Upload new profile picture
 * Uses multer middleware to handle file upload
 * upload.single('profilePicture') - expects field name 'profilePicture'
 */
router.post('/profile/upload', 
    requireLogin, 
    upload.single('profilePicture'),  // Handle single file upload
    profileController.uploadProfilePicture
);

/**
 * POST /profile/delete-picture
 * Delete current profile picture and restore default
 */
router.post('/profile/delete-picture', requireLogin, profileController.deleteProfilePicture);

module.exports = router;