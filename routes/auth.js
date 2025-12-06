// routes/auth.js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// ==================== LOCAL AUTH ====================

// Show Register Page
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register", error: null });
});

// Handle Register
router.post("/register", async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);
    res.redirect("/login");
  } catch (err) {
    res.render("auth/register", { title: "Register", error: err.message });
  }
});

// Show Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Handle Login
router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/tasks"
  })
);

// ==================== GOOGLE OAUTH ====================

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// ==================== GITHUB OAUTH ====================

router.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// ==================== DISCORD OAUTH ====================

router.get("/auth/discord",
  passport.authenticate("discord")
);

router.get("/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// ==================== LOGOUT ====================

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;