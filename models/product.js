const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const p = path.join(
    path.dirname(require.main.filename),
    "data",
    "products.json"
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (!err) {
            return cb(JSON.parse(fileContent));
        }
        return cb([]);
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    (prod) => prod.id == this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log("error: ", err);
                });
            } else {
                this.id = Math.floor(Math.random());
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log("err", err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => prod.id == id);
            const updatedProduct = products.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
                if (!err) {
                    //remove from cart
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => prod.id === Number(id));
            cb(product);
        });
    }
};
