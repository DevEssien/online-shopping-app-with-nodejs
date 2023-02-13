const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
    });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup page",
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req?.body;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
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
                    } else {
                        console.log(err);
                    }
                });
            }
            return res.redirect("/login");
        }
    });
};

exports.postSignup = async (req, res, next) => {
    const { email, password, confirmedPassword } = req?.body;
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
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
