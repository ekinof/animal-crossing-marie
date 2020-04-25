'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VillagerDB extends Model {
    static associate(models) {
      VillagerDB.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  VillagerDB.init({
    // attributes
    userId: { type: DataTypes.BIGINT(11), primaryKey: true },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VillagerDB',
    timestamps: false
  });
  return VillagerDB
}