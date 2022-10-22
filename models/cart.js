const { DataTypes } = require("sequelize");

const ORM = require("../utils/database");
const sequelize = ORM.sequelize;

const Cart = sequelize.define("Cart", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
});

module.exports = Cart;
