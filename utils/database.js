const { Sequelize } = require("sequelize");

exports.sequelize = new Sequelize("online_shop", "root", "@mySQL_300", {
    dialect: "mysql",
    host: "localhost",
});
