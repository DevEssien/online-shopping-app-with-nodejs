require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(shopRoute);
app.use('/admin', adminRoute);

//catch all errors for all routes and send the error page
app.use((req, res, next) => {
res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});

//remember to always branch out and create a new branch to work on a new feature of the project