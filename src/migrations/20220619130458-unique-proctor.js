'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("proctors", {
      type: 'unique',
      fields: ['username', 'administratorId'],
      name: 'unique-proctor-admin-constraint'
    }) 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("proctors", 'unique-proctor-admin-constraint', {})
  }
};
