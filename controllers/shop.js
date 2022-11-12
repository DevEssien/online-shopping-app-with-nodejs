const Product = require("../models/product");

const getIndex = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        if (!products)
            return res
                .status(404)
                .send({ status: "Error", message: "No Record Found" });
        res.render("shop/index", {
            path: "/",
            pageTitle: "Shop",
            products: products,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getProductList = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        if (!products)
            return res
                .status(404)
                .send({ status: "Error", message: "No Record Found" });
        res.render("shop/product-list", {
            path: "/products",
            pageTitle: "Shop",
            products: products,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getProductDetails = async (req, res, next) => {
    const productId = req?.params?.productId;
    try {
        const product = await Product.findOne({ where: { id: productId } });
        if (!product)
            return res
                .status(404)
                .send({ status: "Error", message: "Not Found" });
        res.render("shop/product-detail", {
            path: "/products",
            pageTitle: "Product Details",
            product: product,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getCart = async (req, res, next) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
    });

    // Cart.getCart((cart) => {
    //     const cartProducts = [];
    //     Product.fetchAll((products) => {
    //         for (const product of products) {
    //             const cartProductData = cart?.products.find(
    //                 (prod) => prod.id == product?.id
    //             );
    //             if (cartProductData) {
    //                 cartProducts.push({
    //                     productData: product,
    //                     qty: product?.qty,
    //                 });
    //             }
    //         }
    //         res.render("shop/cart", {
    //             path: "/cart",
    //             pageTitle: "Your Cart",
    //             products: cartProducts,
    //         });
    //     });
    // });
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

const postCart = async (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    fetchedCart = cart;
    let product;
    if (products.length > 0) {
        product = products[0];
    }
    if (product) {
        const oldQuantity = product.CartItem.quantity;
        newQuantity = oldQuantity + 1;
        await fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
        });
    }
    const prod = await Product.findOne({ where: { id: productId } });
    await fetchedCart.addProduct(prod, { through: { quantity: newQuantity } });
    res.redirect("/cart");
};

const postDelCartItems = async (req, res, next) => {
    const prodId = req?.body?.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const product = products[0];
    await product.CartItem.destroy();
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
    postDelCartItems,
};
