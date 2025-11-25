const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerForm = (req, res) => {
    res.render("auth/register");
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashed });

    res.redirect("/login");
};

exports.loginForm = (req, res) => {
    res.render("auth/login");
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.redirect("/login");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/login");

    req.session.user = user;
    res.redirect("/");
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};
