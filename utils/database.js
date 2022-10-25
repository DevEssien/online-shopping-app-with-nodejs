const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("online_shop", "root", "@mySQL_300", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
