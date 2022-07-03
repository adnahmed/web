'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    getFullname() {
      return [this.prefix, this.given_name, this.middle_name, this.last_name].flatMap((elem)=> {elem === null ? [] : [elem]}).join(" ");
    }

    static associate(models) {
      User.hasOne(models['role']);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      prefix: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      given_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      middle_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    }, {
      sequelize,
      modelName: "user",
      timestamps: false,
    }
  );

  return User;
};