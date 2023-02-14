const express = require("express");

const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

/** get routes */
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/password-reset", authController.getReset);

router.get("/password-reset/:token", authController.getNewPassword);

/** post route */
router.post(
    "/login",
    [
        check("email")
            .isEmail()
            .withMessage("please enter a valid email")
            .normalizeEmail(),
        body("password", "Please enter a valid Email!").isAlphanumeric().trim(),
    ],
    authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom(async (email, { req }) => {
                // if (value === 'hack@gmail.com') {
                //     throw new Error('This email is forbidden');
                // }
                // return true;
                try {
                    const foundUser = await User.findOne({ email: email });
                    if (foundUser) {
                        return Promise.reject(
                            new Error(
                                "Email exists already, Enter another Email"
                            )
                        );
                    }
                } catch (err) {
                    console.log(err);
                }
            })
            .normalizeEmail(),
        body(
            "password",
            "Please enter a password with numbers and texts of atleast a length of 4"
        )
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim(),
        body("confirmedPassword")
            .custom((value, { req }) => {
                if (value !== req.body?.password) {
                    throw new Error("Passwords have to match!");
                }
                return true;
            })
            .trim(),
    ],
    authController.postSignup
);

router.post("/password-reset", authController.postReset);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
