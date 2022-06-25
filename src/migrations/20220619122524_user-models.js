const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "administrators", deps: []
 * createTable() => "examinees", deps: [administrators]
 * createTable() => "proctors", deps: [administrators]
 *
 */

const info = {
  revision: 1,
  name: "user-models",
  created: "2022-06-19T12:25:24.047Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "administrators",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          unique: true,
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          field: "first_name",
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING,
          field: "last_name",
          allowNull: false,
        },
        middle_name: {
          type: Sequelize.STRING,
          field: "last_name",
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "examinees",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          field: "first_name",
          allowNull: false,
        },
        middle_name: {
          type: Sequelize.STRING,
          field: "last_name",
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING,
          field: "last_name",
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        administratorId: {
          type: Sequelize.UUID,
          field: "administratorId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "administrators", key: "id" },
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "proctors",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          field: "first_name",
          allowNull: false,
        },
        middle_name: {
          type: Sequelize.STRING,
          field: "last_name",
        },
        last_name: {
          type: Sequelize.STRING,
          field: "last_name",
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        administratorId: {
          type: Sequelize.UUID,
          field: "administratorId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "administrators", key: "id" },
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["administrators", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["examinees", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["proctors", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
