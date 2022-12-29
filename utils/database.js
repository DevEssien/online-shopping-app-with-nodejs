// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("online_shop", "root", "@mySQL_300", {
//     dialect: "mysql",
//     host: "localhost",
// });

// module.exports = sequelize;

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(
    "mongodb://localhost:27017/onlineShopDB",
    {
        useNewUrlParser: true,
    },
    (err) => {
        if (!err) {
            console.log("success");
        }
    }
);
const productSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    price: String,
    description: String,
});

const Product = mongoose.model("Product", productSchema);

const book = new Product({
    title: 'merlin',
    imageUrl: 'photo.com',
    price: '34.3',
    description: 'this book is about a boy with magical powers to protect the prince of camelot from danger'
})
// book.save()

module.exports = Product;
