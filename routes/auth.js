const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

/** get routes */
router.get("/login", authController.getLogin);

/** post route */
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

module.exports = router;
