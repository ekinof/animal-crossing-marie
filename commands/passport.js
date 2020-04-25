const {
  db,
  User,
  AnimalCrossingAccount
} = require('../models')
const {
  MessageEmbed
} = require("discord.js")

module.exports = async message => {
  // check if there is an user who is mentioned
  let user
  const member = message.mentions.members.first()
  if (member !== undefined) {
    user = await User.findByPk(member.id, {
      include: AnimalCrossingAccount
    })
    if (user == null || user.AnimalCrossingAccount == null) {
      return message.reply("L'utilisateur n'a pas défini son profil.")
    }
  } else {

    user = await User.findByPk(message.author.id, {
      include: AnimalCrossingAccount
    })

    // Builde model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        AnimalCrossingAccount: {
          name: null,
          island: null,
          title: null,
          comment: null,
          colour: null,
          photo: 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.png',
          friendCode: null
        }
      }, {
        include: AnimalCrossingAccount
      });
    }

    // Update or set user attributes
    user.username = message.author.username
    user.discriminator = message.author.discriminator
    user.avatar = message.author.avatar

    // If the AC Account of the user doesn't exists, we build it
    if (user.AnimalCrossingAccount == undefined || user.AnimalCrossingAccount == null) {
      user.AnimalCrossingAccount = AnimalCrossingAccount.build({
        userId: message.author.id,
        name: null,
        island: null,
        title: null,
        comment: null,
        colour: null,
        photo: 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.png',
        friendCode: null
      })
    }

    let search
    // Name
    search = /nom="(?<name>[^"]+)"/.exec(message.content)
    if (search !== null && search.groups.name !== undefined) {
      user.AnimalCrossingAccount.name = search.groups.name
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("Peux-tu me redonner ton nom avec tes informations ?")
      }
    }

    // Island
    search = /île="(?<island>[^"]+)"/.exec(message.content)
    if (search !== null && search.groups.island !== undefined) {
      user.AnimalCrossingAccount.island = search.groups.island
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("Je n'arrive pas à trouver ton île...")
      }
    }

    // Title
    search = /titre="(?<title>[^"]+)"/.exec(message.content)
    if (search !== null) {
      if (search.groups.title !== undefined) {
        user.AnimalCrossingAccount.title = search.groups.title
      } else {
        return message.reply("Ton titre n'est pas bon.")
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]+)"/.exec(message.content)
    if (search !== null) {
      if (search.groups.comment !== undefined) {
        user.AnimalCrossingAccount.comment = search.groups.comment
      } else {
        return message.reply("Ton commentaire n'est pas bon.")
      }
    }

    // Colour
    search = /couleur="(?<colour>#[a-fA-F0-9]{6})"/.exec(message.content)
    if (search !== null) {
      if (search.groups.colour !== undefined) {
        user.AnimalCrossingAccount.colour = search.groups.colour
      } else {
        return message.reply("Ta couleur n'est pas bonne.")
      }
    }

    // Photo
    search = /photo="(?<photo>[^"]+)"/.exec(message.content)
    if (search !== null) {
      if (search.groups.photo !== undefined) {
        user.AnimalCrossingAccount.photo = search.groups.photo
      } else {
        return message.reply("Ta photo n'est pas bonne.")
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>[^"]+)"/.exec(message.content)
    if (search !== null && search.groups.friend_code !== undefined) {
      if (search.groups.friend_code !== undefined) {
        user.AnimalCrossingAccount.friendCode = search.groups.friend_code
      } else {
        return message.reply("Ton code ami n'est pas bon.")
      }
    }

    user.save()
    user.AnimalCrossingAccount.save()
  }

  const replyMessage = new MessageEmbed()
    .setTitle(user.AnimalCrossingAccount.name)
    .setAuthor(user.username + '#' + user.discriminator, 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png', 'https://discordapp.com/users/' + user.id)
    .setTimestamp();

  if (user.AnimalCrossingAccount.colour !== null) {
    replyMessage.setColor(user.AnimalCrossingAccount.colour)
  } else {
    replyMessage.setColor('#8addff')
  }

  if (user.AnimalCrossingAccount.photo !== null) {
    replyMessage.setThumbnail(user.AnimalCrossingAccount.photo)
  } else {
    replyMessage.setThumbnail('https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png')
  }

  replyMessage.addField('🏝️ Île', user.AnimalCrossingAccount.island)

  if (user.AnimalCrossingAccount.title !== null) {
    replyMessage.addField('🏷️ Titre', user.AnimalCrossingAccount.title)
  }

  if (user.AnimalCrossingAccount.friendCode !== null) {
    // Break Line
    replyMessage.addField('\u200B', '\u200B')
    replyMessage.addField('👋 Code Ami', user.AnimalCrossingAccount.friendCode)
  }

  if (user.AnimalCrossingAccount.comment !== null) {
    replyMessage.setDescription('💬 ' + user.AnimalCrossingAccount.comment)
  }

  return message.reply(replyMessage)
}