const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Show Register Page
router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

// Handle Register
router.post("/register", async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);
    res.redirect("/login");
  } catch (err) {
    res.render("register", { title: "Register", error: err.message });
  }
});

// Show Login Page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Handle Login
router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/tasks"
  })
);

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;

