'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnimalCrossingAccount extends Model {
    static associate(models) {
      AnimalCrossingAccount.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }

  AnimalCrossingAccount.init({
    // attributes
    userId: { type: DataTypes.BIGINT(11), primaryKey: true },
    name: DataTypes.STRING,
    island: DataTypes.STRING,
    title: DataTypes.STRING,
    comment: DataTypes.STRING,
    colour: DataTypes.STRING,
    photo: DataTypes.STRING,
    friendCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AnimalCrossingAccount'
  });

  return AnimalCrossingAccount;
};