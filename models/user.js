'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.AnimalCrossingAccount, {foreignKey: 'userId'})
      User.hasOne(models.VillagerDB, {foreignKey: 'userId'})
    }
  }
  User.init({
    // attributes
    id: { type: DataTypes.BIGINT(11), primaryKey: true },
    username: DataTypes.STRING,
    discriminator: DataTypes.INTEGER,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User'
  });
  return User
}