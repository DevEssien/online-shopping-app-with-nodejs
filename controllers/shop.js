const { products } = require('./products')

const homeGetRoute = (req, res, next) => {
    res.render('shop', {
        path: '/', 
        pageTitle: 'Shop',
        products: products,
        price: 19.98
    });
};



module.exports = homeGetRoute;