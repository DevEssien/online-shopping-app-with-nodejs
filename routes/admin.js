const express = require("express");
const path = require("path");

const {
    getAddProduct,
    getProducts,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postDeleteProduct,
} = require("../controllers/admin");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

/** GET */ 
router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

/** POST */ 
router.post("/add-product", isAuth, postAddProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
