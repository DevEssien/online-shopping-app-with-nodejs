const Product = require('../models/product')

//GET
const getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        path: '/admin/add-product', 
        pageTitle: 'Add Product',
        productTitle: 'Book2',
        price: 19.98
    });
};

const getProducts = async (req, res, next) => {
    Product.fetchAll( async (products) => {
        res.render('admin/products', {
            path: '/admin/products', 
            pageTitle: 'Admin Products',
            products: await products,
        });
    });
}

const getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Product Controller',
        path: '/admin/edit-product'
    });
}


//POST
const postProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

const postEditProduct = (req, res, next) => {
    res.status(200).send('<h1>Product Edited');
}

const postDeleteProduct = (req, res, next) => {
    //code to delete product
    res.redirect('/admin/products');
}


module.exports = {
    getAddProduct,
    getProducts,
    getEditProduct,
    postProduct,
    postEditProduct,
    postDeleteProduct
};