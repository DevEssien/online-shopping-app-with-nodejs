const express = require("express");
const path = require("path");

const {
    getProductList,
    getIndex,
    getProductDetails,
    getCart,
    getOrders,
    getCheckout,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProductList);

router.get("/products/:productId", getProductDetails);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

module.exports = router;
