const { default: mongoose } = require("mongoose");
const { Product, Cart } = require("../utils/database");

const getIndex = (req, res, next) => {
    try {
        Product.find((error, products) => {
            if (!error) {
                console.log("products =", products);
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
    console.log(productId);
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
    Cart.find((error, cart) => {
        if (!error) {
            if (cart === null) {
                res.redirect("/cart");
            }
            Product.find((error, products) => {
                if (!error) {
                    res.render("shop/cart", {
                        path: "/cart",
                        pageTitle: "Your Cart",
                        products: products,
                    });
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log(error);
        }
    });
};

// const getOrders = async (req, res, next) => {
//     const orders = await req.user.getOrders({ include: ["Products"] });
//     res.render("shop/orders", {
//         pageTitle: "Your Order",
//         path: "/orders",
//         orders: orders,
//     });
//     // console.log(orders.OrderItem);
// };

// const getCheckout = (req, res, next) => {
//     res.render("shop/checkout", {
//         path: "/checkout",
//         pageTitle: "Checkout",
//     });
// };

// const postCart = async (req, res, next) => {
//     const productId = req.body.productId;
//     let fetchedCart;
//     let newQuantity = 1;
//     const cart = await req.user.getCart();
//     const products = await cart.getProducts({ where: { id: productId } });
//     fetchedCart = cart;
//     let product;
//     if (products.length > 0) {
//         product = products[0];
//     }
//     if (product) {
//         const oldQuantity = product.CartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         await fetchedCart.addProduct(product, {
//             through: { quantity: newQuantity },
//         });
//     }
//     const prod = await Product.findOne({ where: { id: productId } });
//     await fetchedCart.addProduct(prod, { through: { quantity: newQuantity } });
//     res.redirect("/cart");
// };

// const postDelCartItems = async (req, res, next) => {
//     const prodId = req?.body?.productId;
//     const cart = await req.user.getCart();
//     const products = await cart.getProducts({ where: { id: prodId } });
//     const product = products[0];
//     await product.CartItem.destroy();
//     res.redirect("/cart");
// };

// const postCreateOrder = async (req, res, next) => {
//     const cart = await req.user.getCart();
//     const products = await cart.getProducts();
//     const order = await req.user.createOrder();
//     await order.addProducts(
//         products.map((product) => {
//             product.OrderItem = { quantity: product.CartItem.quantity };
//             return product;
//         })
//     );
//     await cart.setProducts(null);
//     res.redirect("/orders");
// };

// module.exports = {
//     getProductList,
//     getIndex,
//     getProductDetails,
//     getCart,
//     getOrders,
//     getCheckout,
//     postCart,
//     postDelCartItems,
//     postCreateOrder,
// };

module.exports = { getIndex, getProductList, getProductDetails, getCart };
