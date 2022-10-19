const Product = require("../models/product");

const getIndex = async (req, res, next) => {
    Product.fetchAll(async (products) => {
        res.render("shop/index", {
            path: "/",
            pageTitle: "Shop",
            products: await products,
        });
    });
};

const getProductList = (req, res, next) => {
    Product.fetchAll(async (products) => {
        res.render("shop/product-list", {
            path: "/products",
            pageTitle: "Shop",
            products: await products,
        });
    });
};

const getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, (product) => {
        res.render("shop/product-detail", {
            path: "/products",
            pageTitle: "Product Details",
            product: product,
        });
    });
};

const getCart = (req, res, next) => {
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
    });
};

const getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Your Order",
        path: "/orders",
    });
};

const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    // Product.findById(productId, (product) => {
    //     res.render("/shop/cart", {
    //         path: "/cart",
    //         pageTitle: "Cart",
    //         product: product,
    //     });
    // });
    res.redirect("/cart");
};

module.exports = {
    getProductList,
    getIndex,
    getProductDetails,
    getCart,
    getOrders,
    getCheckout,
    postCart,
};
