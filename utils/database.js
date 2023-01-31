const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const mongodb = mongoose.connect(
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

module.exports = mongodb;

// const userSchema = new mongoose.Schema({
//     username: String,
//     email: String,
//     cart: [
//         {
//             productId: String,
//             title: String,
//             quantity: Number,
//         },
//     ],
// });

// const productSchema = new mongoose.Schema({
//     title: String,
//     imageUrl: String,
//     price: String,
//     description: String,
//     userId: String,
// });

// const OrderSchema = new mongoose.Schema({
//     items: Array,
//     user: {
//         _id: String,
//         name: String,
//     },
// });

// const User = mongoose.model("User", userSchema);

// const Product = mongoose.model("Product", productSchema);

// const Order = mongoose.model("Order", OrderSchema);

// const book = new Product({
//     title: "merlin",
//     imageUrl: "photo.com",
//     price: "34.3",
//     description:
//         "this book is about a boy with magical powers to protect the prince of camelot from danger",
// });
// // book.save()

// const user1 = new User({
//     username: "Essien Emmanuel",
//     email: "essienemma300dev@gmail.com",
// });
// // user1.save();

// module.exports = { Product, User, Order };

//db.users.updateMany({},{$unset: {cart: []}}) to clear cart
