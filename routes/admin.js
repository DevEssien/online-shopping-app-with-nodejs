const express = require("express");
const path = require("path");

const {
    getAddProduct,
    getProducts,
    getEditProduct,
    getDeleteProduct,
    postAddProduct,
    postEditProduct,
    postDeleteProduct,
} = require("../controllers/admin");

const router = express.Router();

//GET
router.get("/add-product", getAddProduct);

router.get("/products", getProducts);

router.get("/edit-product/:productId", getEditProduct);

router.get("/delete-product", getDeleteProduct);

//POST
router.post("/add-product", postAddProduct);

router.post("/edit-product", postEditProduct);

router.post("/delete-product", postDeleteProduct);

module.exports = router;
