const express = require('express');
const path = require('path');

const  { prodGetRoute, prodPostRoute} = require('../controllers/products');


const router = express.Router();

router.get('/add-product', prodGetRoute);

router.get('/product', (req, res, next) => {
    res.status(200).send('getting a product');
});

router.post('/add-product', prodPostRoute);

module.exports = router;
