const express = require("express");

const { getLogin, postLogin } = require("../controllers/auth");

const router = express.Router();

/** get routes */
router.get("/login", getLogin);

/** post route */
router.post("/login", postLogin);

module.exports = router;
