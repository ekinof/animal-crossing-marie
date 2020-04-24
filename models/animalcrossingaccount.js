'use strict';
const { MessageEmbed } = require("discord.js")
module.exports = (sequelize, DataTypes) => {
  const AnimalCrossingAccount = sequelize.define('AnimalCrossingAccount', {
    userId: { type: DataTypes.BIGINT(11), primaryKey: true },
    name: DataTypes.STRING,
    island: DataTypes.STRING,
    title: DataTypes.STRING,
    comment: DataTypes.STRING,
    colour: DataTypes.STRING,
    photo: DataTypes.STRING,
    friendCode: DataTypes.STRING
  }, {});
  AnimalCrossingAccount.associate = function(models) {
    AnimalCrossingAccount.belongsTo(models.User, {foreignKey: 'userId', as: 'user'})
  }
  AnimalCrossingAccount.getPassport = function () {
    const replyMessage = new MessageEmbed()
      .setColor('#8addff')
      .setTitle(this.name)
      .setAuthor(this.user.username+'#'+this.user.discriminator, 'https://cdn.discordapp.com/avatars/'+this.user.id+'/'+this.user.avatar+'.png', 'https://discordapp.com/users/'+this.user.id)
      .setTimestamp();

      if (this.photo!==null) {
        replyMessage.setThumbnail(photo)
      } else {
        replyMessage.setThumbnail('https://cdn.discordapp.com/avatars/'+this.user.id+'/'+this.user.avatar+'.png')
      }

      replyMessage.addField('🏝️ Île', this.island)

      if (this.title!==null) {
        replyMessage.addField('Titre', this.title)
      }
      
      if (this.friendCode!==null) {
        // Break Line
        replyMessage.addField('\u200B', '\u200B')
        replyMessage.addField('Code Ami', this.friendCode )
      }

      if (this.comment!==null) {
        replyMessage.setDescription('💬 '+this.comment);
      }

      return replyMessage
  }
  return AnimalCrossingAccount;
};