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
    try {
        const products = await req.user.getProducts();
        if (!products)
            return res
                .status(404)
                .send({ status: "Error", message: "No Record Found" });
        res.render("admin/products", {
            path: "/admin/products",
            pageTitle: "Admin Products",
            products: products,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getEditProduct = async (req, res, next) => {
    const editMode = req?.query?.edit;
    if (!editMode) {
        console.log("redirected");
        return res.redirect("/");
    }
    const productId = req?.params?.productId;
    try {
        const products = await req.user.getProducts({
            where: { id: productId },
        });
        const product = products[0];
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product,
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
    ``;
};

//POST
const postAddProduct = async (req, res, next) => {
    try {
        const { title, imageUrl, description, price } = req?.body;
        await req.user.createProduct({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
        });
        res.redirect("/admin/products");
    } catch (error) {
        console.log("error: ", error);
    }
};

const postEditProduct = async (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;
    const product = await Product.findOne({ where: { id: productId } });
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    await product.save();
    res.redirect("/admin/products");
};

const postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req?.body?.productId;
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return res.redirect("/admin/products");
        }
        await product.destroy();
        return res.redirect("/admin/products");
    } catch (error) {
        console.log("error: ", error);
    }
};

module.exports = {
    getAddProduct,
    getProducts,
    getEditProduct,
    postAddProduct,
    postEditProduct,
    postDeleteProduct,
};
