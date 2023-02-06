const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

/** get routes */
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

/** post route */
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
