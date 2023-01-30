require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

const errorController = require("./controllers/error");
const shopRoute = require("./routes/shop");
const adminRoute = require("./routes/admin");
const { Product, User } = require("./utils/database");

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    try {
        User.find({ _id: "63c006b507de2030963c37f0" }, (error, user) => {
            if (!error) {
                if (!user) {
                    console.log("No User Found");
                    return;
                }
                req.user = user;
                // console.log("found user with username: ", user[0]?.username);
                next();
            } else {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
});
app.use(shopRoute);
app.use("/admin", adminRoute);
app.use(errorController.catchError);

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});

//remember to always branch out and create a new branch to work on a new feature of the project
