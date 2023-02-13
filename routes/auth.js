const express = require("express");

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

router.post("/signup", authController.postSignup);

router.post("/password-reset", authController.postReset);

router.post('/new-password', authController.postNewPassword)

module.exports = router;
