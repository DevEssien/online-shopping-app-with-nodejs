const { Product } = require("../utils/database");

//GET
const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Add Product",
        editing: false,
    });
};

const getProducts = (req, res, next) => {
    try {
        Product.find((error, products) => {
            if (!error) {
                if (!products)
                    return res
                        .status(404)
                        .send({ status: "Error", message: "No Record Found" });
                res.render("admin/products", {
                    path: "/admin/products",
                    pageTitle: "Admin Products",
                    products: products,
                });
            } else {
                console.log("getProduct Error => ", error);
            }
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

////POST
const postAddProduct = (req, res, next) => {
    try {
        const { title, imageUrl, description, price } = req?.body;
        const userId = req?.user[0]?._id; //getting the saved id from the req.user
        const newProduct = new Product({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
            userId: userId,
        });
        newProduct.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.log("error: ", error);
    }
};

const postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    } = req.body;

    Product.updateOne(
        { _id: productId },
        {
            title: updatedTitle,
            imageUrl: updatedImageUrl,
            description: updatedDescription,
            price: updatedPrice,
        },
        (error) => {
            if (!error) {
                console.log("updated sucessfully");
            } else {
                console.log("something went wrong, error => ", error);
            }
        }
    );
    res.redirect("/admin/products");
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
