const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    const isLoggedIn =
        req.get("Cookie")?.split(";")[0]?.trim()?.split("=")[1] === "true";
    console.log(isLoggedIn);
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: isLoggedIn,
    });
};

exports.postLogin = async (req, res, next) => {
    // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    const user = await User.findById("63da202313c0901164941806");
    req.session.user = user;
    console.log(req.session.user);
    req.session.isLoggedIn = true;
    res.redirect("/");
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
// module.exports = { getLogin, postLogin };
