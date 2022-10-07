const sequelize = require("sequelize");
require('dotenv').config();

module.exports = {
    PORT: 5000,
    sequelize_config: new sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        '',
        {
            dialect: process.env.DB_DIALECT
        }
    ),
    timestamp_config: {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
    },
    bitly: {
        access_token: process.env.BITLY_TOKEN,
        group_guid: process.env.BITLY_GROUP_GUID,
        url: 'https://api-ssl.bitly.com/v4/shorten'
    }
}