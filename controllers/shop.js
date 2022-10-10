const Product = require('../models/product');

const homeGetRoute = (req, res, next) => {
    const products = Product.fetchAll();
    res.render('shop', {
        path: '/', 
        pageTitle: 'Shop',
        products: products,
        price: 19.98
    });
};



module.exports = homeGetRoute;