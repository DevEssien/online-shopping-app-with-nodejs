const express = require("express");
const path = require("path");

const {
    getIndex,
    getProductList,
    // getProductDetails,
    // getCart,
    // getOrders,
    // getCheckout,
    // postCart,
    // postDelCartItems,
    // postCreateOrder,
} = require("../controllers/shop");

const router = express.Router();

/**
 * GET route
 */

router.get("/", getIndex);

router.get("/products", getProductList);

// router.get("/products/:productId", getProductDetails);

// router.get("/cart", getCart);

// router.get("/orders", getOrders);

// router.get("/checkout", getCheckout);

// /**
//  * POST route
//  */

// router.post("/cart-delete-items", postDelCartItems);

// router.post("/cart", postCart);

// router.post("/create-order", postCreateOrder);

module.exports = router;
