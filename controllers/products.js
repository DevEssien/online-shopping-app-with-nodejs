const Product = require('../models/product')

//GET
const prodGetRoute = (req, res, next) => {
    res.render('add-product', {
        path: '/admin/add-product', 
        pageTitle: 'Add Product',
        productTitle: 'Book2',
        price: 19.98
    });
};


//POST
const prodPostRoute = (req, res, next) => {
    const { title } = req.body;
    const product = new Product(title);
    product.save();
    res.redirect('/');
};

module.exports = {
    prodGetRoute,
    prodPostRoute
};