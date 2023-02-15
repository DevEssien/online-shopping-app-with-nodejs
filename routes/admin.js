const express = require("express");
const { body } = require("express-validator/check");
const adminController = require("../controllers/admin");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

/** GET */
router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

/** POST */
router.post(
    "/add-product",
    isAuth,
    [
        body("title").isString().isLength({ min: 3 }).trim(),
        body("price").isFloat().trim(),
        body("description").isLength({ min: 10, max: 200 }).trim(),
    ],
    adminController.postAddProduct
);

router.post(
    "/edit-product",
    isAuth,
    [
        body("title").isString().isLength({ min: 3 }).trim(),
        body("price").isFloat().trim(),
        body("description").isLength({ min: 10, max: 200 }).trim(),
    ],
    adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
