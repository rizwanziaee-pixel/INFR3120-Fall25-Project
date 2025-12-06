// models/User.js
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
        sparse: true,
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
    
    // Profile picture path
    profilePicture: {
        type: String,
        default: '/images/default-avatar.JPEG'
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
    timestamps: true
});

// Add passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);