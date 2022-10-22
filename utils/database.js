const { Sequelize } = require("sequelize");

exports.sequelize = new Sequelize("onlineShop", "root", "@mySQL_300", {
    dialect: "mysql",
    host: "localhost",
});
