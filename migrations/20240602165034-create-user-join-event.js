'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserJoinEvents', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      eventId: {
        type: Sequelize.UUID
      },
      profileId: {
        type: Sequelize.UUID
      },
      joinDate: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserJoinEvents');
  }
};