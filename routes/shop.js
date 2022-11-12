const express = require("express");
const path = require("path");

const {
    getProductList,
    getIndex,
    getProductDetails,
    getCart,
    getOrders,
    getCheckout,
    postDelCartItems,
    postCart,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProductList);

router.get("/products/:productId", getProductDetails);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

router.post("/cart-delete-items", postDelCartItems);

router.post("/cart", postCart);

module.exports = router;
