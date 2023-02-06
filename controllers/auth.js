const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: false,
    });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup page",
        isAuthenticated: false,
    });
};

exports.postLogin = async (req, res, next) => {
    const user = await User.findById("63da202313c0901164941806");
    req.session.user = user;
    req.session.isLoggedIn = true;
    //making sure session is true before redirecting
    req.session.save((err) => {
        if (!err) {
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
// module.exports = { getLogin, postLogin };
