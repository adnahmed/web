'use strict';

const { query } = require("express");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("examinees", {
      type: 'unique',
      fields: ['username', 'administratorId'],
      name: 'unique-examinee-admin-constraint'
    }) 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("examinees", 'unique-examinee-admin-constraint', {})
  }
};
