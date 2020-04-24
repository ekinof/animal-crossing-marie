'use strict';
const { MessageEmbed } = require("discord.js")
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
  User.getPassport = function () {
    const replyMessage = new MessageEmbed()
      .setColor('#8addff')
      .setTitle(name)
      .setAuthor(message.author.username+'#'+message.author.discriminator, 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png', 'https://discordapp.com/users/+'+message.author.id)
      .setTimestamp();

      if (photo!==null) {
        replyMessage.setThumbnail(photo)
      } else {
        replyMessage.setThumbnail('https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png')
      }

      replyMessage.addField('🏝️ Île', island)

      if (title!==null) {
        replyMessage.addField('Titre', title)
      }
      
      if (friendCode!==null) {
        // Break Line
        replyMessage.addField('\u200B', '\u200B')
        replyMessage.addField('Code Ami', friendCode )
      }

      if (comment!==null) {
        replyMessage.setDescription('💬 '+comment);
      }

      return replyMessage
  }
  return User;
};