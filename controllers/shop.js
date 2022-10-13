const Product = require("../models/product");

const getProductList = (req, res, next) => {
    Product.fetchAll(async (products) => {
        res.render("shop/product-list", {
            path: "/",
            pageTitle: "Shop",
            products: await products,
            price: 19.98,
        });
    });
};

const getIndex = async (req, res, next) => {
    Product.fetchAll(async (products) => {
        res.render("shop/index", {
            path: "/Products",
            pageTitle: "Shop",
            products: await products,
            price: 19.98,
        });
    });
};

const getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetchAll((products) => {
        products.forEach((product, index) => {
            if (product.id === Number(productId)) {
                res.render("shop/details", {
                    path: "/products/details",
                    pageTitle: "Product Details",
                    product: product,
                });
                return product;
            }
            return;
        });
    });
};

const getCart = async (req, res, next) => {
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

const getCheckout = async (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

module.exports = {
    getProductList,
    getIndex,
    getProductDetails,
    getCart,
    getOrders,
    getCheckout,
};
