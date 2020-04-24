const {db, User, AnimalCrossingAccount} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  // check if there is an user who is mentioned
  let user
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: AnimalCrossingAccount })
    if (user==undefined || user.AnimalCrossingAccount==undefined) {
      return message.reply("L'utilisateur n'a pas défini son profil.")
    }
  } else {
    // else it has to be the definition of parametters
    const userParams = {
      id: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator,
      avatar: message.author.avatar,
      AnimalCrossingAccount : {
        name: null,
        island: null,
        title: null,
        comment: null,
        colour: null,
        photo: 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png',
        friendCode: null
      }
    }

    let search
    // Name
    search = /nom="(?<name>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.name!==undefined) {
      userParams.AnimalCrossingAccount.name = search.groups.name
    } else {
      return message.reply("Peux-tu me redonner ton nom avec tes informations ?")
    }

    // Island
    search = /ile="(?<island>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.island!==undefined) {
      userParams.AnimalCrossingAccount.island = search.groups.island
    } else {
      return message.reply("Je n'arrive pas à trouver ton ile...")
    }

    // Title
    search = /titre="(?<title>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if(search.groups.title!==undefined) {
        userParams.AnimalCrossingAccount.title = search.groups.title
      } else {
        return message.reply("Ton titre n'est pas bon.")
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.comment!==undefined) {
        userParams.AnimalCrossingAccount.comment = search.groups.comment
      } else {
        return message.reply("Ton commentaire n'est pas bon.")
      }
    }

    // Colour
    search = /couleur="(?<colour>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.colour!==undefined) {
        userParams.AnimalCrossingAccount.colour = search.groups.colour
      } else {
        return message.reply("Ta couleur n'est pas bonne.")
      }
    }

    // Photo
    search = /photo="(?<photo>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.photo!==undefined) {
        userParams.AnimalCrossingAccount.photo = search.groups.photo
      } else {
        return message.reply("Ta photo n'est pas bonne.")
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.friend_code!==undefined) {
      if (search.groups.friend_code!==undefined) {
        userParams.AnimalCrossingAccount.friendCode = search.groups.friend_code
      } else {
        return message.reply("Ton code ami n'est pas bonne.")
      }
    }

    user = await User.create(userParams, {include: AnimalCrossingAccount})
  }

  const replyMessage = new MessageEmbed()
    .setTitle(user.AnimalCrossingAccount.name)
    .setAuthor(user.username+'#'+user.discriminator, 'https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.png', 'https://discordapp.com/users/'+user.id)
    .setTimestamp();

    if (user.AnimalCrossingAccount.colour!==null) {
      replyMessage.setColor('#8addff')
    }

    if (user.AnimalCrossingAccount.photo!==null) {
      replyMessage.setThumbnail(user.AnimalCrossingAccount.photo)
    } else {
      replyMessage.setThumbnail('https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.png')
    }

    replyMessage.addField('🏝️ Île', user.AnimalCrossingAccount.island)

    if (user.AnimalCrossingAccount.title!==null) {
      replyMessage.addField('🏷️ Titre', user.AnimalCrossingAccount.title)
    }
    
    if (user.AnimalCrossingAccount.friendCode!==null) {
      // Break Line
      replyMessage.addField('\u200B', '\u200B')
      replyMessage.addField('👋 Code Ami', user.AnimalCrossingAccount.friendCode )
    }

    if (user.AnimalCrossingAccount.comment!==null) {
      replyMessage.setDescription('💬 '+user.AnimalCrossingAccount.comment);
    }

  return message.reply(replyMessage);
}