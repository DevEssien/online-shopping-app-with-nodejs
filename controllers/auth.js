const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Mail = require("../Externals/send-mail");
const { validationResult } = require("express-validator/check");

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash("error");
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
        previousInput: {
            email: "",
            password: "",
        },
        validationErrors: [],
    });
};

exports.getSignup = (req, res, next) => {
    const errorMessage = req.flash("error");
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup page",
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
        previousInput: {
            email: "",
            password: "",
            confirmedPassword: "",
        },
        validationErrors: [],
    });
};

exports.getReset = (req, res, next) => {
    const errorMessage = req.flash("error");
    res.render("auth/password-reset", {
        path: "/password-reset",
        pageTitle: "password reset",
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
    });
};

exports.getNewPassword = async (req, res, next) => {
    const token = req.params.token;
    const errorMessage = req.flash("error");
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    });
    console.log("user from get new password", user);
    if (!user) {
        return res.redirect("/password-reset");
    }
    res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "new password set",
        errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
        userId: user?._id,
        passwordToken: token,
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req?.body;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
        req.flash("error", "Invalid Email");
        let errorMessage = req.flash("error");
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
            previousInput: {
                email: email,
                password: password,
            },
            validationErrors: [],
        });
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
                        //sending a mail
                        const subject = "Your login in is successful!";
                        const textPart =
                            "Dear Customer, welcome to Essien's store!";
                        const htmlPart =
                            "<h3>Dear Customer, welcome to Essien's store</h3><br />May the delivery force be with you!";
                        // Mail.sendmail(email, subject, textPart, htmlPart);
                    } else {
                        console.log(err);
                    }
                });
            }
            req.flash("error", "Invalid Password");
            let errorMessage = req.flash("error");
            return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "login",
                errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
                previousInput: {
                    email: email,
                    password: password,
                },
                validationErrors: [{ param: "password" }],
            });
        }
    });
};

exports.postSignup = async (req, res, next) => {
    const { email, password, confirmedPassword } = req?.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup page",
            errorMessage: errors.array()[0].msg,
            previousInput: {
                email: email,
                password: password,
                confirmedPassword: confirmedPassword,
            },
            validationErrors: errors.array(),
        });
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

exports.postReset = async (req, res, next) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect("/password-reset");
        }
        const token = buffer.toString("hex");
        const user = await User.findOne({ email: req.body?.email });
        if (!user) {
            req.flash("error", "No account with this Email found!");
            return res.redirect("/password-reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //current date + 1hr(in milliseconds)
        user.save((err) => {
            if (!err) {
                res.redirect("/");
            }
        });
        //sending an email for password reset
        //sending a mail
        const subject = "Password Reset";
        const textPart =
            "Dear Customer, welcome to Essien's security services!";
        const htmlPart = `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to set new password</p>
        `;
        Mail.sendmail(req.body?.email, subject, textPart, htmlPart);
    });
};

exports.postNewPassword = async (req, res, next) => {
    const { userId, passwordToken, newPassword } = req.body;
    console.log("user ", userId);
    const user = await User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    user.save((err) => {
        if (!err) {
            return res.redirect("/login");
            const subject = "Password Reset";
            const textPart =
                "Dear Customer, welcome to Essien's security services!";
            const htmlPart = "<h3>You successfully changed your password</h3>";
            Mail.sendmail(req.body?.email, subject, textPart, htmlPart);
        }
        return res.redirect("/password-reset");
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
