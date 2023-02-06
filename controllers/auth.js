const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    // const isLoggedIn =
    //     req.get("Cookie")?.split(";")[0]?.trim()?.split("=")[1] === "true";
    const isLoggedIn = req.session.isLoggedIn;
    // console.log("isloggedin", isLoggedIn);
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: isLoggedIn,
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
    // res.redirect("/");
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
// module.exports = { getLogin, postLogin };
