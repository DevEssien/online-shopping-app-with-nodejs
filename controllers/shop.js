const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const getIndex = async (req, res, next) => {
    try {
        Product.find((error, products) => {
            if (!error) {
                if (!products)
                    return res
                        .status(404)
                        .send({ status: "Error", message: "No Record Found" });
                res.render("shop/index", {
                    path: "/",
                    pageTitle: "Shop",
                    products: products,
                });
            } else {
                console.log("error occurred");
                console.log("err ", error);
            }
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getProductList = (req, res, next) => {
    try {
        Product.find((error, products) => {
            if (!error) {
                if (!products)
                    return res
                        .status(404)
                        .send({ status: "Error", message: "No Record Found" });
                res.render("shop/product-list", {
                    path: "/products",
                    pageTitle: "Shop",
                    products: products,
                });
            }
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getProductDetails = (req, res, next) => {
    const productId = req?.params?.productId;
    try {
        Product.find({ _id: productId }, (error, products) => {
            if (!error) {
                if (!products)
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Not Found" });
                res.render("shop/product-detail", {
                    path: "/products",
                    pageTitle: "Product Details",
                    product: products,
                });
            }
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getCart = async (req, res, next) => {
    const userId = req?.user[0]?._id;

    const user = await User.findOne({ _id: userId })
        .populate("cart.items.productId")
        .exec(); //to get the product using the productId of the user cart collection
    const cartItems = user.cart.items;

    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cart: cartItems,
    });
};

const getOrders = async (req, res, next) => {
    const userId = req?.user[0]?._id;
    const _id = userId.toString();
    const orders = await Order.find({ "user.userId": userId });

    res.render("shop/orders", {
        pageTitle: "Your Order",
        path: "/orders",
        orders: orders,
    });
    // console.log(JSON.stringify(orders, null, 2));
};

// const getCheckout = (req, res, next) => {
//     res.render("shop/checkout", {
//         path: "/checkout",
//         pageTitle: "Checkout",
//     });
// };

const postCart = async function (req, res, next) {
    const productId = req.body.productId;
    const user = req?.user[0];
    const product = await Product.findById(productId);
    user.addToCart(product);
    res.redirect("/cart");
};

const postDelCartItems = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const user = req?.user[0];
        user.deleteCartItem(productId);
        res.redirect("/cart");
    } catch (error) {
        console.log("error: ", error);
    }
};

const postCreateOrder = async (req, res, next) => {
    const userId = req?.user[0]?._id;

    const user = await User.findOne({ _id: userId })
        .populate("cart.items.productId")
        .exec(); //to get the product using the productId of the user cart collection
    const products = user.cart.items.map((product) => {
        return {
            product: { ...product.productId._doc },
            quantity: product.quantity,
        };
    });
    const order = new Order({
        user: {
            name: user.username,
            userId: userId,
        },
        products: products,
    });
    order.save();
    req.user[0].clearCart();
    res.redirect("/orders");
};

module.exports = {
    getIndex,
    getProductList,
    getProductDetails,
    getCart,
    getOrders,
    postCart,
    postDelCartItems,
    postCreateOrder,
    // getCheckout,
};
