const express = require("express");
const path = require("path");

const shopController = require("../controllers/shop");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

/**
 * GET route
 */

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProductList);

router.get("/products/:productId", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCart);

router.get("/checkout", shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

// /**
//  * POST route
//  */

router.post("/cart-delete-items", isAuth, shopController.postDelCartItems);

router.post("/cart", isAuth, shopController.postCart);

router.post("/create-order", isAuth, shopController.postCreateOrder);

module.exports = router;
