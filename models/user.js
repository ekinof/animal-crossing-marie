'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.INTEGER,
    discordName: DataTypes.STRING,
    name: DataTypes.STRING,
    island: DataTypes.STRING,
    title: DataTypes.STRING,
    comment: DataTypes.STRING,
    colour: DataTypes.STRING,
    photo: DataTypes.STRING,
    friendCode: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};