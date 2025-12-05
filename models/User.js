// models/User.js
// MEMBER 1: Updated User model with profile picture support

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    // Basic user information
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    
    // Email for password recovery and notifications
    email: {
        type: String,
        sparse: true,  // Allows multiple null values
        unique: true,
        lowercase: true,
        trim: true
    },
    
    // OAuth provider IDs (for social login)
    googleId: {
        type: String,
        sparse: true
    },
    
    githubId: {
        type: String,
        sparse: true
    },
    
    // MEMBER 1: Profile picture path
    // Stores the path to the uploaded image
    profilePicture: {
        type: String,
        default: '/images/default-avatar.png'  // Default avatar if no picture uploaded
    },
    
    // Password reset functionality
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});

// Add passport-local-mongoose plugin
// This adds username/password authentication functionality
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);