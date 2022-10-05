const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    //res.status(200).sendFile(path.join(__dirname, '../views/add-product.html'));
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

router.get('/product', (req, res, next) => {
    res.status(200).send('getting a product');
});

module.exports = router;