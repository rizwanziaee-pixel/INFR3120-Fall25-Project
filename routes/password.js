const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Only allow logged-in users
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// Show password change form
router.get("/change", requireAuth, (req, res) => {
    res.render("changePassword", { 
        title: "Change Password",
        error: null,
        success: null
    });
});

// Process password change
router.post("/change", requireAuth, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check new passwords match
    if (newPassword !== confirmPassword) {
        return res.render("changePassword", {
            title: "Change Password",
            error: "New passwords do not match.",
            success: null
        });
    }

    try {
        // changePassword() comes from passport-local-mongoose
        await req.user.changePassword(currentPassword, newPassword);

        return res.render("changePassword", {
            title: "Change Password",
            error: null,
            success: "Password updated successfully!"
        });

    } catch (err) {
        return res.render("changePassword", {
            title: "Change Password",
            error: "Current password is incorrect.",
            success: null
        });
    }
});

module.exports = router;