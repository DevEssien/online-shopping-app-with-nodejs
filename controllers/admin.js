const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

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
        const products = await Product.find({ userId: req.user._id });
        console.log("getProduct", products);
        res.render("admin/products", {
            path: "/admin/products",
            pageTitle: "Admin Products",
            products: products === null ? [] : products,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
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
                console.log(error);
            }
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

// ////POST
exports.postAddProduct = (req, res, next) => {
    try {
        const { title, imageUrl, description, price } = req?.body;
        const userId = req.user?._id; //getting the saved id from the req.user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/edit-product",
                editing: false,
                hasError: true,
                product: {
                    title: title,
                    imageUrl: imageUrl,
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
            }
        });
    } catch (error) {
        console.log("error: ", error);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const userId = req?.user?._id;
    const user = await User.find({ _id: userId });
    const {
        productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;

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
                imageUrl: updatedImageUrl,
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
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    product.price = updatedPrice;
    return product.save((err) => {
        if (!err) {
            console.log("updated successfully");
            res.redirect("/admin/products");
        } else {
            console.log("something went wrong, error => ", error);
        }
    });
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req?.body?.productId;
        Product.deleteOne({ _id: productId }, (err, product) => {
            if (err) {
                console.log(err);
            }
            if (!product) {
                return res.redirect("/admin/products");
            }
        });
        return res.redirect("/admin/products");
    } catch (error) {
        console.log("error: ", error);
    }
};
