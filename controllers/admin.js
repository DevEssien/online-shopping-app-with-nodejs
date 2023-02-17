const mongoose = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const errorController = require("../controllers/error");
const fileHandler = require("../utils/file");
const product = require("../models/product");

const ITEMS_PER_PAGE = 3;

//GET
exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Add Product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};

exports.getProducts = async (req, res, next) => {
    try {
        // const page = +req.query.page || 1;
        // const totalProductNum = await Product.find({
        //     userId: req.user._id,
        // }).countDocuments();
        // const products = await Product.find()
        //     .skip((page - 1) * ITEMS_PER_PAGE)
        //     .limit(ITEMS_PER_PAGE);
        // if (!products)
        //     return res
        //         .status(404)
        //         .send({ status: "Error", message: "No Record Found" });
        /////////////////////////
        const products = await Product.find({ userId: req.user._id });
        console.log("entering", products);
        res.render("admin/products", {
            path: "/admin/products",
            pageTitle: "Admin Products",
            products: products === null ? [] : products,
        });
    } catch (err) {
        errorController.throwError(err, next);
    }
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req?.query?.edit;
    if (!editMode) {
        console.log("redirected");
        return res.redirect("/");
    }
    const productId = req?.params?.productId;
    try {
        Product.find({ _id: productId }, (error, product) => {
            if (!error) {
                if (!product) {
                    return res.redirect("/");
                }
                res.render("admin/edit-product", {
                    pageTitle: "Edit Product",
                    path: "/admin/edit-product",
                    editing: editMode,
                    product: product[0],
                    hasError: false,
                    errorMessage: null,
                    validationErrors: [],
                });
            } else {
                errorController.throwError(error, next);
            }
        });
    } catch (error) {
        errorController.throwError(error, next);
    }
};

// ////POST
exports.postAddProduct = (req, res, next) => {
    try {
        const { title, description, price } = req?.body;
        const image = req.file;
        if (!image) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                hasError: true,
                product: {
                    title: title,
                    price: price,
                    description: description,
                },
                errorMessage: "Attached file is not an image",
                validationErrors: [],
            });
        }

        const imageUrl = image.path;

        const userId = req.user?._id; //getting the saved id from the req.user
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                hasError: true,
                product: {
                    title: title,
                    price: price,
                    description: description,
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const newProduct = new Product({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
            userId: userId,
        });
        newProduct.save((err) => {
            if (!err) {
                res.redirect("/admin/products");
            } else {
                errorController.throwError(err, next);
            }
        });
    } catch (error) {
        errorController.throwError(error, next);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const userId = req?.user?._id;
    const user = await User.find({ _id: userId });
    const {
        productId,
        title: updatedTitle,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;
    const image = req.file;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            product: {
                _id: productId,
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }
    const product = await Product.findById(productId);
    if (userId.toString() !== product.userId.toString()) {
        return res.redirect("/");
    }
    product.title = updatedTitle;
    if (image) {
        fileHandler.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
    }
    product.description = updatedDescription;
    product.price = updatedPrice;
    return product.save((err) => {
        if (!err) {
            res.redirect("/admin/products");
        } else {
            errorController.throwError(err, next);
        }
    });
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req?.body?.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new Error("No product found"));
        }
        fileHandler.deleteFile(product.imageUrl);
        Product.deleteOne({ _id: productId }, (err, product) => {
            if (err) {
                errorController.throwError(err, next);
            }
            if (!product) {
                return res.redirect("/admin/products");
            }
        });
        return res.redirect("/admin/products");
    } catch (error) {
        next(error);
    }
};
