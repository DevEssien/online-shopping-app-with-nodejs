const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
});

module.exports = Order;
