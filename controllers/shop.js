const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const errorController = require("../controllers/error");
const PDFDocument = require("pdfkit");

exports.getIndex = (req, res, next) => {
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
                errorController.throwError(error);
            }
        });
    } catch (error) {
        errorController.throwError(error);
    }
};

exports.getProductList = (req, res, next) => {
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
        errorController.throwError(error);
    }
};

exports.getProductDetails = (req, res, next) => {
    const productId = req?.params?.productId;
    try {
        Product.findById(productId, (error, products) => {
            console.log("products ", products);
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
        errorController.throwError(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const user = await User.findOne({ _id: userId })
            .populate("cart.items.productId")
            .exec(); //to get the product using the productId of the user cart collection
        const cartItems = user.cart.items;

        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            cart: cartItems,
        });
    } catch (err) {
        errorController.throwError(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const orders = await Order.find({ "user.userId": userId });

        res.render("shop/orders", {
            pageTitle: "Your Order",
            path: "/orders",
            orders: orders,
        });
        // console.log(JSON.stringify(orders, null, 2));
    } catch (err) {
        errorController.throwError(err, next);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new Error("No order found!"));
        }
        if (order?.user?.userId.toString() !== req?.user?._id.toString()) {
            return next(new Error("Unauthorized"));
        }

        const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);

        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));

        res.setHeader("content-Type", "application/pdf");
        res.setHeader(
            "content-Disposition",
            'attachment; filename= "' + invoiceName + '"'
        );

        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text("Invoice", {
            underline: true,
        });
        pdfDoc.fontSize(14).text("---------------------------");

        let totalPrice = 0;
        order.products.forEach((product) => {
            pdfDoc
                .fontSize(14)
                .text(
                    `item - ${product.product.title} x ${product.quantity} ($${product.product.price})`
                );
            totalPrice += product.quantity * Number(product.product.price);
        });

        pdfDoc.text("----");

        pdfDoc.fontSize(14).text(`Total Price: $${totalPrice}`);
        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     res.setHeader("content-Type", "application/pdf");
        //     res.setHeader(
        //         "content-Disposition",
        //         'attachment; filename= "' + invoiceName + '"'
        //     );
        //     res.status(200).send(data);
        // });
        // const file = fs.createReadStream(invoicePath);

        // file.pipe(res);
    } catch (err) {
        errorController.throwError(err, next);
    }
};
// const getCheckout = (req, res, next) => {
//     res.render("shop/checkout", {
//         path: "/checkout",
//         pageTitle: "Checkout",
//     });
// };

exports.postCart = async function (req, res, next) {
    try {
        const productId = req.body.productId;
        const user = req?.user;
        const product = await Product.findById(productId);
        user.addToCart(product);
        res.redirect("/cart");
    } catch (err) {
        errorController.throwError(err);
    }
};

exports.postDelCartItems = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const user = req?.user;
        user.deleteCartItem(productId);
        res.redirect("/cart");
    } catch (error) {
        errorController.throwError(error);
    }
};

exports.postCreateOrder = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
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
                email: req.user.email,
                userId: userId,
            },
            products: products,
        });
        order.save((err) => {
            if (!err) {
                req?.user.clearCart();
                res.redirect("/orders");
            } else {
                errorController.throwError(err);
            }
        });
    } catch (err) {
        errorController.throwError(err);
    }
};
