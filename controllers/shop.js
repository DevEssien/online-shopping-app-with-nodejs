const { default: mongoose } = require("mongoose");
const { Product, User } = require("../utils/database");

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
    const userId = req?.user[0]?._id;
    const user = await User.findOne({ _id: userId });
    const cart = user?.cart;

    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cart: cart,
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

// [
//     {
//       _id: ObjectId("63aeeda272901c8f49db2c2b"),
//       username: 'Essien Emmanuel',
//       email: 'essienemma300dev@gmail.com',
//       cart: { items: [ { productId: null, quantity: 0 } ] },
//       __v: 0
//     }
//   ]

//product
// [
//     {
//       _id: ObjectId("63aef14d50b5e01f5dd45376"),
//       title: 'antman',
//       imageUrl: 'marvel.com',
//       price: '245',
//       description: 'guy can change the atomic structure of his body',
//       userId: '63aeeda272901c8f49db2c2b',
//       __v: 0
//     }
//   ]

const postCart = async (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let updatedCart;
    let newQuantity = 1;
    const userId = req?.user[0]?._id;
    const user = await User.findOne({ _id: userId });
    const product = await Product.findOne({ _id: productId });
    let prod = product;
    const cart = user?.cart;

    fetchedCart = cart;

    if (cart.length === 0) {
        User.updateOne(
            { _id: userId },
            {
                cart: [
                    {
                        productId: productId,
                        quantity: newQuantity,
                        title: product.title,
                    },
                ],
            },
            (err) => {
                if (!err) {
                    console.log("working");
                }
            }
        );
    } else {
        for (let product of cart) {
            if (product.productId === productId) {
                product.quantity += 1;

                updatedCart = User.updateOne(
                    { _id: userId },
                    {
                        cart: [...cart],
                    },

                    (err) => {
                        if (!err) {
                            console.log("working too much");
                        }
                    }
                );
                res.redirect("/cart");
                return;
            }
        }
        User.updateOne(
            { _id: userId },
            {
                cart: [
                    ...fetchedCart,
                    {
                        productId: productId,
                        quantity: newQuantity,
                        title: prod.title,
                    },
                ],
            },
            (err) => {
                if (!err) {
                    console.log("working too");
                }
            }
        );
    }
    res.redirect("/cart");
};

const postDelCartItems = async (req, res, next) => {
    try {
        const userId = req?.user[0]?._id;
        const user = await User.findOne({ _id: userId });
        const cart = user?.cart;
        const productId = req?.body?.productId;

        if (cart.length > 0) {
            const updatedCart = cart.filter((product) => {
                if (product.productId !== productId) {
                    return product;
                }
            });
            User.updateOne(
                { _id: userId },
                {
                    cart: [...updatedCart],
                },

                (err) => {
                    if (!err) {
                        console.log("deleted product from cart");
                    }
                }
            );
            res.redirect("/cart");
        }
    } catch (error) {
        console.log("error: ", error);
    }
};

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

module.exports = {
    getIndex,
    getProductList,
    getProductDetails,
    getCart,
    postCart,
    postDelCartItems,
};
