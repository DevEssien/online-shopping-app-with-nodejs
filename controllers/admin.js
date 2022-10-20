const Product = require("../models/product");

//GET
const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Add Product",
        editing: false,
    });
};

const getProducts = async (req, res, next) => {
    Product.fetchAll(async (products) => {
        res.render("admin/products", {
            path: "/admin/products",
            pageTitle: "Admin Products",
            products: await products,
        });
    });
};

const getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log("redirected");
        return res.redirect("/");
    }
    const productId = req.params.productId;
    Product.findById(productId, (product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product,
        });
    });
};

//POST
const postProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/");
};

const postEditProduct = (req, res, next) => {
    res.status(200).send("<h1>Product Edited");
};

const postDeleteProduct = (req, res, next) => {
    //code to delete product
    res.redirect("/admin/products");
};

module.exports = {
    getAddProduct,
    getProducts,
    getEditProduct,
    postProduct,
    postEditProduct,
    postDeleteProduct,
};
