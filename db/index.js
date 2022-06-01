const { Sequelize } = require("sequelize");
const { db } = require("../config");
const sequelize = new Sequelize(db.connectionString); // Example for postgres

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  await sequelize.sync();
})();
module.exports = sequelize;
