'use strict';
const { Model } = require('sequelize');
const { timestamp_config } = require("../../../config.js")
const PROTECTED_ATTRIBUTES = [
  'password'
];
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullname: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Please enter your fullname',
      },
      validate: {
        len: [3, 50]
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your username',
      },
      unique: {
        args: true,
        msg: 'Username already exists',
      },
      validate: {
        len: [6, 16]
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your password',
      },
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    ...timestamp_config,
    sequelize,
    modelName: 'User',
  });
  return User;
};