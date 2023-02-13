require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const Mailjet = require("node-mailjet");

const errorController = require("./controllers/error");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

const User = require("./models/user");
const port = 3000;
const MONGODB_URI = "mongodb://localhost:27017/onlineShopDB";
const csrfProtection = csrf();

const store = new mongoDBStore({
    uri: MONGODB_URI,
    collections: "sessions",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "thisIsMySECRET",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
    try {
        if (!req.session?.user) {
            return next();
        }
        const user = await User.findById(req.session?.user?._id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// app.use(express.json);

app.use(errorController.catchError);

/** connecting to mongodb */
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

{
    /* <input type="hidden" name="_csrf" value="<%=csrfToken%>"> */
}
