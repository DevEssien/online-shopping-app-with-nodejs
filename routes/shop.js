const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

router.post('/', (req, res, next) => {
    res.status(200).send('post request made');
})

module.exports = router;