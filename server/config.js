const sequelize = require("sequelize");
require('dotenv').config();

module.exports = {
    // sequelize_config: new sequelize(
    //     process.env.DB_NAME,
    //     process.env.DB_USER,
    //     '',
    //     {
    //         dialect: process.env.DB_DIALECT
    //     }
    // ),
    timestamp_config: {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
    }
}