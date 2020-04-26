const {db, User, AnimalCrossingAccount} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  // check if there is an user who is mentioned
  let user
  let discord_avatar = 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png'
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: AnimalCrossingAccount })
    if (user==null || user.AnimalCrossingAccount==null) {
      return message.reply("l'utilisateur-trice n'a pas édité son **Passeport**.")
    } else {
      message.reply('voici le **Passeport** de '+user.username+' :')
    }
  } else {

    user = await User.findByPk(message.author.id, { include: AnimalCrossingAccount })

    // Build model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        AnimalCrossingAccount: {
          name: null,
          island: "Inconnue...",
          title: null,
          comment: null,
          colour: null,
          photo: discord_avatar,
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
    if (user.AnimalCrossingAccount==undefined || user.AnimalCrossingAccount==null) {
      user.AnimalCrossingAccount = AnimalCrossingAccount.build({
        userId: message.author.id,
        name: null,
        island: "Inconnue...",
        title: null,
        comment: null,
        colour: null,
        photo: discord_avatar,
        friendCode: null
      })
    }

    let search
    let param
    // Name
    search = /nom="(?<name>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.name!==undefined) {
      user.AnimalCrossingAccount.name = search.groups.name
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("peux-tu me redonner ton nom avec tes informations stp ?")
      }
    }

    // Island
    search = /[iî]le="(?<island>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.island!==undefined) {
      user.AnimalCrossingAccount.island = search.groups.island
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("je n'arrive pas à trouver ton île...")
      }
    }

    // Title
    search = /titre="(?<title>[^"]+)"/.exec(message.content)
    param = /titre="(?<title_data>.*)"/.exec(message.content)
    if (search!==null) {
      if(search.groups.title!==undefined) {
        user.AnimalCrossingAccount.title = search.groups.title
      } else {
        return message.reply("ton titre ne semble pas être correct. Recommence stp.")
      }
    } else if (search==null && param!==null) {
      if (param.groups.title_data !== "") {
        return message.reply("ton titre ne semble pas être correct. Recommence stp.")
      } else {
        user.AnimalCrossingAccount.title = null // delete title
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]+)"/.exec(message.content)
    param = /commentaire="(?<comment_data>.*)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.comment!==undefined) {
        user.AnimalCrossingAccount.comment = search.groups.comment
      } else {
        return message.reply("ton commentaire ne peux pas fonctionner, tu as autre chose ?")
      }
    } else if (search==null && param!==null) {
      if (param.groups.comment_data !== "") {
        return message.reply("ton commentaire ne peux pas fonctionner, tu as autre chose ?")
      } else {
        user.AnimalCrossingAccount.comment = null // delete comment
      }
    }

    // Colour
    search = /couleur="(?<colour>#[a-fA-F0-9]{6})"/.exec(message.content)
    param = /couleur=/.exec(message.content)
    if (search!==null) {
      if (search.groups.colour!==undefined) {
        user.AnimalCrossingAccount.colour = search.groups.colour
      } else {
        return message.reply("ta couleur n'est pas bonne.")
      }
    } else if (search==null && param!==null) {
      return message.reply("ta couleur n'est surement pas au bon format, voici un exemple de ce qu'il faut entrer : **#f7e38c**. Si tu veux, tu peux aller sur https://www.color-hex.com/ pour trouver une jolie couleur !")
    }

    // Photo
    search = /photo="(?<photo>[^"]+)"/.exec(message.content)
    param = /photo="(?<photo_data>.*)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.photo!==undefined) {
        user.AnimalCrossingAccount.photo = search.groups.photo
      } else {
        return message.reply("ta photo n'est pas bonne. Essaie un autre lien si tu le veux bien :)")
      }
    } else if (search==null && param!==null) {
      if (param.groups.photo_data !== "") {
        return message.reply("ta photo n'est pas bonne. Essaie un autre lien si tu le veux bien :)")
      } else {
        user.AnimalCrossingAccount.photo = discord_avatar // delete personnal photo
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>SW-[0-9]{4}-[0-9]{4}-[0-9]{4})"/.exec(message.content)
    param = /code-ami="(?<fc_data>.*)"/.exec(message.content)
    if (search!==null && search.groups.friend_code!==undefined) {
      if (search.groups.friend_code!==undefined) {
        user.AnimalCrossingAccount.friendCode = search.groups.friend_code
      } else {
        return message.reply("ton code ami n'est pas bon.")
      }
    } else if (search==null && param!==null) {
      if (param.groups.fc_data !== "") {
        return message.reply("ton code ami n'est pas bon, tu t'es peut-être trompé-e quelque part... Il doit ressembler à ça : **SW-0000-0000-0000**")
      } else {
        user.AnimalCrossingAccount.friendCode = null // delete friend-code
      }
    }

    user.save()
    user.AnimalCrossingAccount.save()

    message.reply('voici ton **Passeport** :')
  }

  const replyMessage = new MessageEmbed()
    .setTitle(user.AnimalCrossingAccount.name)
    .setAuthor(user.username+'#'+user.discriminator, discord_avatar, 'https://discordapp.com/users/'+user.id)
    .setTimestamp();

    if (user.AnimalCrossingAccount.colour!==null) {
      replyMessage.setColor(user.AnimalCrossingAccount.colour)
    } else {
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
      replyMessage.setDescription('💬 '+user.AnimalCrossingAccount.comment)
    }

    return message.channel.send(replyMessage)
}