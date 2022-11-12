require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

const shopRoute = require("./routes/shop");
const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: 1 },
        });
        console.log("user => ", user.id);
        if (!user) {
            console.log("No User Found");
            return;
        }
        req.user = user;

        console.log("req.usr => ", req.user);
        next();
    } catch (error) {
        console.log(error);
    }
});
app.use(shopRoute);
app.use("/admin", adminRoute);

User.hasMany(Product);
Product.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE",
});

User.hasOne(Cart);
Cart.belongsTo(User);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

const createTable = async () => {
    try {
        // await sequelize.sync({ force: true });
        await sequelize.sync();
        const user = await User.findOne({ where: { id: 1 } });
        if (user) {
            console.log("Found User");
        }
        await User.create({
            name: "Max",
            email: "max@gmail.com",
        });
        console.log("Tables created");
        return await user.createCart();
    } catch (error) {
        console.log("error", error);
        return;
    }
};
// createTable();

//catch all errors for all routes and send the error page
app.use(errorController.catchError);

app.listen(port, () => {
    console.log(`server spinning at port ${port}`);
});

//remember to always branch out and create a new branch to work on a new feature of the project
