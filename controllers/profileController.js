// controllers/profileController.js
// MEMBER 1: All profile-related logic

const User = require("../models/User");
const path = require("path");
const fs = require("fs");

/**
 * VIEW PROFILE
 * Display the user's profile page
 */
exports.viewProfile = (req, res) => {
    res.render("profile/view", { 
        title: "My Profile",
        success: req.flash('success'),
        error: req.flash('error')
    });
};

/**
 * EDIT PROFILE FORM
 * Show the edit profile page
 */
exports.editProfileForm = (req, res) => {
    res.render("profile/edit", { 
        title: "Edit Profile",
        error: req.flash('error')
    });
};

/**
 * UPDATE PROFILE
 * Save changes to user profile (username, email)
 */
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Find the current user
        const user = await User.findById(req.user._id);
        
        // Update fields
        user.username = username;
        if (email) user.email = email;
        
        // Save to database
        await user.save();
        
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile');
        
    } catch (err) {
        console.error('Error updating profile:', err);
        req.flash('error', 'An error occurred updating your profile.');
        res.redirect('/profile/edit');
    }
};

/**
 * UPLOAD PROFILE PICTURE
 * Handle image upload and update user's profile picture
 */
exports.uploadProfilePicture = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            req.flash('error', 'Please select an image to upload.');
            return res.redirect('/profile');
        }

        // Find the current user
        const user = await User.findById(req.user._id);
        
        // Delete old profile picture (if not default)
        if (user.profilePicture && user.profilePicture !== '/images/default-avatar.png') {
            const oldPath = path.join(__dirname, '..', 'public', user.profilePicture);
            
            // Check if old file exists and delete it
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                console.log('Old profile picture deleted:', oldPath);
            }
        }
        
        // Update user's profile picture path
        user.profilePicture = '/uploads/' + req.file.filename;
        await user.save();
        
        console.log('New profile picture saved:', user.profilePicture);
        
        req.flash('success', 'Profile picture updated successfully!');
        res.redirect('/profile');
        
    } catch (err) {
        console.error('Error uploading profile picture:', err);
        req.flash('error', 'An error occurred uploading your image.');
        res.redirect('/profile');
    }
};

/**
 * DELETE PROFILE PICTURE
 * Remove current profile picture and restore default
 */
exports.deleteProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Only delete if not already default
        if (user.profilePicture && user.profilePicture !== '/images/default-avatar.png') {
            const oldPath = path.join(__dirname, '..', 'public', user.profilePicture);
            
            // Delete file from server
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            
            // Reset to default avatar
            user.profilePicture = '/images/default-avatar.png';
            await user.save();
            
            req.flash('success', 'Profile picture removed successfully!');
        } else {
            req.flash('error', 'You are already using the default avatar.');
        }
        
        res.redirect('/profile');
        
    } catch (err) {
        console.error('Error deleting profile picture:', err);
        req.flash('error', 'An error occurred removing your profile picture.');
        res.redirect('/profile');
    }
};