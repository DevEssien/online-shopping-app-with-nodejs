const express = require("express");

const app = express();

app.use((req, res, next) => {
    console.log("user", req);
    console.log(res);
    next();
});

app.listen(3000, () => {
    console.log(`server spinning at port 3000`);
});
