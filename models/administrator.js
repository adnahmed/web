const { DataTypes, Model } = require('sequelize');
const sequelize = require("../db/index");
const Examinee = require("./examinee");
const Proctor = require("./proctor");
class Administrator extends Model {
  getFullname() {
    return [this.first_name, this.last_name].join(" ");
  }
}
Administrator.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "administrator",
    timestamps: false,
  }
);

Administrator.belongsToMany(Examinee, {
  through: "administrator_examinee",
});
Administrator.belongsToMany(Proctor, {
  through: "administrator_proctor",
});

Examinee.belongsToMany(Administrator, {
  through: 'administrator_examinee',
  as: 'examinee'
});

Proctor.belongsToMany(Administrator, {
  through: 'administrator_proctor',
  as: 'proctor'
});
module.exports = Administrator;
