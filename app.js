require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');

const port = 3000;

const app = express();

app.use(userRoute);
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});
