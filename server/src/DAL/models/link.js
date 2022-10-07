'use strict';
const { Model } = require('sequelize');
const { timestamp_config } = require("../../../config.js")

const PROTECTED_ATTRIBUTES = [];

module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
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
  Link.init({
    long_url: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Please enter URL to shorter',
      },
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Please enter URL',
      },
    },
    bit_id: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Please enter bitly id',
      },
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    ...timestamp_config,
    sequelize,
    modelName: 'Link',
  });
  return Link;
};