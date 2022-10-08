const express = require('express');
const path = require('path');

const homeGetRoute = require('../controllers/shop');


const router = express.Router();

router.get('/', homeGetRoute);



module.exports = router;