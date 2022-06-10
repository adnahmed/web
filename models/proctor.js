const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/index');
class Proctor extends Model { 
    getFullname() {
        return [this.first_name, this.last_name].join(' ');
    }
    static associate(models) {
        Proctor.belongsTo(models.Administrator);
    }
}
Proctor.init({
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
    modelName: 'proctor',
    timestamps: false,
});


module.exports = Proctor;