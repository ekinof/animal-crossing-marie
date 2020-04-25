'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('VillagerDBs', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT(11)
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('VillagerDBs');
  }
};