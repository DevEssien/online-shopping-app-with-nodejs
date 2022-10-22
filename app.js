require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

const shopRoute = require("./routes/shop");
const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
// const Product = require("./models/product");
const Cart = require("./models/cart");
const ORM = require("./utils/database");
const sequelize = ORM.sequelize;

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(shopRoute);
app.use("/admin", adminRoute);

//catch all errors for all routes and send the error page
app.use(errorController.catchError);

const createTable = async () => {
    try {
        await sequelize.sync({ force: true });
    } catch (error) {
        console.log("error", error);
        return;
    }
    console.log("Tables created");
};
// createTable();

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});

//remember to always branch out and create a new branch to work on a new feature of the project
