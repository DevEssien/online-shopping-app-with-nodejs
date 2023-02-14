const express = require("express");

const { check, body } = require('express-validator/check')

const authController = require("../controllers/auth");

const router = express.Router();

/** get routes */
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/password-reset", authController.getReset);

router.get('/password-reset/:token', authController.getNewPassword)

/** post route */
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {req}) => {
        if (value === 'hack@gmail.com') {
            throw new Error('This email is forbidden');
        }
        return true;
    }),
    body('password', 'Please enter a password with numbers and texts of atleast a length of 4')
    .isLength({min: 4})
    .isAlphanumeric(),
    body('confirmedPassword').custom((value, {req}) => {
        if (value !== req.body?.password) {
            throw new Error('Passwords have to match!')
        }
        return true;
    })
], 
authController.postSignup
);

router.post("/password-reset", authController.postReset);

router.post('/new-password', authController.postNewPassword)

module.exports = router;
