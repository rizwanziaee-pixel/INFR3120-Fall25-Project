const User = require("../models/User");
const passport = require("../config/passport");

exports.registerForm = (req, res) => {
    res.render("auth/register");
};

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username });
        await User.register(user, password);
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/");
        });
    } catch (err) {
        res.redirect("/register");
    }
};

exports.loginForm = (req, res) => {
    res.render("auth/login");
};

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
};
