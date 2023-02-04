require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const User = require("./models/user");
const port = 3000;
const MONGODB_URI = "mongodb://localhost:27017/onlineShopDB";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const store = new mongoDBStore({
    uri: MONGODB_URI,
    collections: "sessions",
});
app.use(
    session({
        secret: "thisIsMySECRET",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    try {
        User.find({ _id: "63da202313c0901164941806" }, (error, user) => {
            if (!error) {
                if (!user) {
                    console.log("No User Found");
                    return;
                }
                req.user = user;
                next();
            } else {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// app.use(express.json);

//creating user if non in the user db
const createUser = async () => {
    const user = await User.findOne();
    if (!user) {
        const user1 = new User({
            username: "Essien Emmanuel",
            email: "essienemma300dev@gmail.com",
            cart: { items: [] },
        });
        user1.save();
    }
};
createUser();

app.use(errorController.catchError);

//connecting to mongodb
mongoose.set("strictQuery", false);

mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
    },
    (err) => {
        if (!err) {
            console.log("connected successfully");
        }
    }
);

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});

//remember to always branch out and create a new branch to work on a new feature of the project
