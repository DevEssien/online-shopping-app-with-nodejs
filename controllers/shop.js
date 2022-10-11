const Product = require('../models/product');

const homeGetRoute = (req, res, next) => {
    Product.fetchAll( async (products) => {
        res.render('shop', {
            path: '/', 
            pageTitle: 'Shop',
            products: await products,
            price: 19.98
        });
    });
};



module.exports = homeGetRoute;