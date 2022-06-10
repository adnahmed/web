'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Examinee extends Model { 
        getFullname() {
            return [this.first_name, this.last_name].join(' ');
        }
        static associate(models) {
            Examinee.belongsTo(models.Administrator);
        }
    }
    Examinee.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    }, {
        sequelize,
        modelName: 'examinee',
        timestamps: false,
    });

  return Examinee;
};