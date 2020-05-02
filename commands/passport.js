const {db, User, AnimalCrossingAccount} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  let user
  let discord_avatar = 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png'
  // Initialize a var to allow adding a message before final return
  let preMessage

  // check if there is an user who is mentioned
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: AnimalCrossingAccount })
    if (user==null || user.AnimalCrossingAccount==null) {
      return message.reply("l'utilisateur-trice n'a pas édité son **Passeport**.")
    } else {
      preMessage = 'voici le **Passeport** de '+user.username+' :'
    }
  } else {
    // if no user mentionned that is we are editing one

    // we check the channel is made for editing values with BOT
    let is_edit = /[a-z\-]{1,}="([^"]{0,})"/.exec(message.content)
    let allowed_channel_id = JSON.parse(process.env.DISCORD_SERVER_CHANNELS)    
    
    if (!allowed_channel_id.includes(message.channel.id) && is_edit!==null) {
      return message.reply("tu ne peux éditer ton profil que dans l'un de ces salons : <#"+allowed_channel_id.join("> <#")+">")
    }

    user = await User.findByPk(message.author.id, { include: AnimalCrossingAccount })

    // Build model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        AnimalCrossingAccount: {
          name: null,
          island: null,
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
        island: null,
        title: null,
        comment: null,
        colour: null,
        photo: discord_avatar,
        friendCode: null
      })
    }

    let search
    // Name
    search = /nom="(?<name>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.name!==undefined) {
      user.AnimalCrossingAccount.name = search.groups.name
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("peux-tu me redonner ton **nom** avec tes informations stp ?")
      }
    }

    // Island
    search = /[iî]le="(?<island>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if(search.groups.island!==undefined && search.groups.island!=="") {
        user.AnimalCrossingAccount.island = search.groups.island
      } else if (search.groups.island!==undefined && search.groups.island=="") {
        user.AnimalCrossingAccount.island = null
      } else {
        return message.reply("j'ai un petit problème concernant ton **île**. Tu peux recommencer si tu veux.")
      }
    }

    // Title
    search = /titre="(?<title>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if(search.groups.title!==undefined && search.groups.title!=="") {
        user.AnimalCrossingAccount.title = search.groups.title
      } else if (search.groups.title!==undefined && search.groups.title=="") {
        user.AnimalCrossingAccount.title = null
      } else {
        return message.reply("ton **titre** semble me poser quelques soucis... Regarde si tu n'as pas fait d'erreur.")
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if (search.groups.comment!==undefined && search.groups.comment!=="") {
        user.AnimalCrossingAccount.comment = search.groups.comment
      } else if (search.groups.comment!==undefined && search.groups.comment=="") {
        user.AnimalCrossingAccount.comment = null
      } else {
        return message.reply("ton **commentaire** ne peut pas être ajouté, il y a peut-être une erreur ?")
      }
    }

    // Colour
    search = /couleur="(?<colour>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if (search.groups.colour!==undefined && search.groups.colour!=="") {
        if (/#[a-fA-F0-9]{6}/.test(search.groups.colour)) {
          user.AnimalCrossingAccount.colour = search.groups.colour
        } else {
          return message.reply("ta **couleur** n'est surement pas au bon format, voici un exemple de ce qu'il faut entrer : **#f7e38c**. Si tu veux, tu peux aller sur https://www.color-hex.com/ pour trouver une jolie couleur !")
        }
      } else if (search.groups.colour!==undefined && search.groups.colour=="") {
        user.AnimalCrossingAccount.colour = null
      } else {
        return message.reply("petit problème concernant ta **couleur**. On retente, vas-y :)")
      }
    }

    // Photo
    search = /photo="(?<photo>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if (search.groups.photo!==undefined && search.groups.photo!=="") {
        if (/([https://|http://])*(?:[www.])*\w+\.\w+\D+/.test(search.groups.photo)) {
          user.AnimalCrossingAccount.photo = search.groups.photo
        } else {
          return message.reply("essaie de mettre un lien valide pour ta **photo** stp, ça devrait marcher !")
        }
      } else if (search.groups.photo!==undefined && search.groups.photo=="") {
        user.AnimalCrossingAccount.photo = discord_avatar
      } else {
        return message.reply("ta **photo** n'est pas bonne. Essaie un autre lien si tu le veux bien :)")
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>[^"]{0,})"/.exec(message.content)
    if (search!==null) {
      if (search.groups.friend_code!==undefined && search.groups.friend_code!=="") {
        if (/(?:SW-)*[0-9]{4}-[0-9]{4}-[0-9]{4}/.test(search.groups.friend_code)) {
          user.AnimalCrossingAccount.friend_code = search.groups.friend_code
        } else {
          return message.reply("ton **code ami** n'est pas bon, tu t'es peut-être trompé-e quelque part... Il doit ressembler à ça : **SW-0000-0000-0000**")
        }        
      } else if (search.groups.friend_code!==undefined && search.groups.friend_code=="") {
        user.AnimalCrossingAccount.friend_code = null
      } else {
        return message.reply("aïe, petit bug au niveau du **code ami**, retente stp.")
      }
    }

    user.save()
    user.AnimalCrossingAccount.save()

    preMessage = 'voici ton **Passeport** :'
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

    if (user.AnimalCrossingAccount.island!==null) {
      replyMessage.addField('🏝️ Île', user.AnimalCrossingAccount.island)
    } else {
      replyMessage.addField('🏝️ Île', 'Inconnue...')
    }

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

    if (preMessage) {
      message.reply(preMessage)
    }
    
    return message.channel.send(replyMessage)
}