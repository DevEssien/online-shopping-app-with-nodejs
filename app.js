require('dotenv').config();

const express = require('express');

const port = 3000;

const app = express();

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});
