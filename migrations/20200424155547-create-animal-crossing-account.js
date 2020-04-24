'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AnimalCrossingAccounts', {
      userId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.BIGINT(11)
      },
      name: {
        type: Sequelize.STRING
      },
      island: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      colour: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      friendCode: {
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AnimalCrossingAccounts');
  }
};