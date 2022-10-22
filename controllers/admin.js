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

const getDeleteProduct = (req, res, next) => {
    res.send("working");
};

//POST
const postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/");
};

const postEditProduct = (req, res, next) => {
    const {
        productId: updatedProductId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;
    const updatedProduct = new Product(
        updatedProductId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect("/admin/products");
};

const postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect("/admin/products");
};

module.exports = {
    getAddProduct,
    getProducts,
    getEditProduct,
    getDeleteProduct,
    postAddProduct,
    postEditProduct,
    postDeleteProduct,
};
