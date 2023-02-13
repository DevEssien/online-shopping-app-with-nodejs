const Product = require("../models/product");
const User = require("../models/user");

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
        const products = await Product.findOne({ userId: req.user._id})
        res.render("admin/products", {
            path: "/admin/products",
            pageTitle: "Admin Products",
            products: products === null ? [] : [ products ],
        });
    } catch (error) {
        console.log("error: ", error);
        return res
            .status(500)
            .send({ status: "Error", message: "Internal Server Error" });
    }
};

const getEditProduct = (req, res, next) => {
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
const postAddProduct = (req, res, next) => {
    try {
        const { title, imageUrl, description, price } = req?.body;
        const userId = req.user?._id; //getting the saved id from the req.user
        console.log("userId", userId);
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

const postEditProduct = async (req, res, next) => {
    const userId = req?.user?._id;
    const user = await User.findOne({ _id: userId });
    const {
        productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;

    const product = await Product.findById(productId);
    if (userId.toString() !== product.userId.toString()) {
        console.log('not user')
        return res.redirect('/')
    }
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    product.price = updatedPrice;
    return product.save((err) => {
        if (!err) {  
            console.log('updated successfully')      
            res.redirect("/admin/products");
        } else {
            console.log("something went wrong, error => ", error)
        }
    })
};

const postDeleteProduct = async (req, res, next) => {
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

module.exports = {
    getAddProduct,
    getProducts,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postDeleteProduct,
};
