'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Examinee extends Model { 
        getFullname() {
            return [this.first_name, this.middle_name, this.last_name].join(' ');
        }
        static associate(models) {
            Examinee.belongsTo(models['administrator']);
        }
    }
    Examinee.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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