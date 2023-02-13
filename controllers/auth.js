const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Mail = require("../Externals/send-mail");

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash("error");
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        errorMessage: errorMessage.length === 0 ? null : errorMessage[0],
    });
};

exports.getSignup = (req, res, next) => {
    const errorMessage = req.flash("error");
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup page",
        errorMessage: errorMessage.length === 0 ? null : errorMessage[0],
    });
};

exports.getReset = (req, res, next) => {
    const errorMessage = req.flash("error");
    res.render("auth/password-reset", {
        path: "/password-reset",
        pageTitle: "password reset",
        errorMessage: errorMessage.length === 0 ? null : errorMessage[0],
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req?.body;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
        req.flash("error", "Invalid Email");
        return res.redirect("/login");
    }
    await bcrypt.compare(password, foundUser.password, (err, passwordMatch) => {
        if (!err) {
            if (passwordMatch) {
                req.session.user = foundUser;
                req.session.isLoggedIn = true;
                //making sure session is true before redirecting
                return req.session.save((err) => {
                    if (!err) {
                        res.redirect("/");
                        Mail.sendmail(email);
                    } else {
                        console.log(err);
                    }
                });
            }
            req.flash("error", "Invalid Password");
            return res.redirect("/login");
        }
    });
};

exports.postSignup = async (req, res, next) => {
    const { email, password, confirmedPassword } = req?.body;
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
        req.flash("error", "Email exists already, Enter another Email");
        return res.redirect("/signup");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
    });
    return user.save((err) => {
        if (!err) {
            res.redirect("/login");
        }
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (!err) {
            return res.redirect("/");
        }
        console.log(err);
    });
};

// module.exports = { getLogin, postLogin };
