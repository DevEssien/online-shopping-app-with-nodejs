const express = require("express");
const path = require("path");

const {
    getIndex,
    getProductList,
    getProductDetails,
    getCart,
    getOrders,
    // getCheckout,
    postCart,
    postDelCartItems,
    postCreateOrder,
} = require("../controllers/shop");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

/**
 * GET route
 */

router.get("/", getIndex);

router.get("/products", getProductList);

router.get("/products/:productId", getProductDetails);

router.get("/cart", isAuth, getCart);

router.get("/orders", isAuth, getOrders);

// router.get("/checkout", getCheckout);

// /**
//  * POST route
//  */

router.post("/cart-delete-items", isAuth, postDelCartItems);

router.post("/cart", isAuth, postCart);

router.post("/create-order", isAuth, postCreateOrder);

module.exports = router;
