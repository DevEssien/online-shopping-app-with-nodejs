const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
});

module.exports = OrderItem;
