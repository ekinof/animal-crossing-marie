'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT(11), primaryKey: true },
    username: DataTypes.STRING,
    discriminator: DataTypes.INTEGER,
    avatar: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasOne(models.AnimalCrossingAccount, {foreignKey: 'userId', as: 'animalCrossingAccount'})
  }
  return User
};