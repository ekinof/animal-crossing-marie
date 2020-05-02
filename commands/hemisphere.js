const {db, User, AnimalCrossingAccount} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  let user
  let discord_avatar = 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png'

  // check if there is an user who is mentioned
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: AnimalCrossingAccount })
    if (user==null || user.AnimalCrossingAccount==null || user.AnimalCrossingAccount.hemisphere==null) {
      return message.reply("l'utilisateur-trice n'a pas défini l'hémisphère le/laquelle iel habite")
    } else {
      if (user.AnimalCrossingAccount.hemisphere == 'n') {
        return message.reply(user.username+" se trouve dans **l'hémisphère Nord**.")
      } else {
        return message.reply(user.username+" se trouve dans **l'hémisphère Sud**.")
      }
    }
  } else {
    // if no user mentionned that is we are editing one

    // we check the channel is made for editing values with BOT
    let is_edit = /!hemisphere ([a-zA-Z]{1,})/.exec(message.content)
    let allowed_channel_id = JSON.parse(process.env.DISCORD_SERVER_CHANNELS)
    
    user = await User.findByPk(message.author.id, { include: AnimalCrossingAccount })

    if (is_edit===null) {
      if (user!==null && user.AnimalCrossingAccount!==null && user.AnimalCrossingAccount.hemisphere!==null) {
        if (user.AnimalCrossingAccount.hemisphere== 'n') {
          return message.reply("tu es dans **l'hémisphère Nord**.")
        } else {
          return message.reply("tu es dans **l'hémisphère Sud**.")
        }
      } else {
        return message.reply("tu n'as paramétré ton hémisphère.")
      }
    } else {
      if (!allowed_channel_id.includes(message.channel.id)) {
        return message.reply("tu ne peux éditer ton profil que dans l'un de ces salons : <#"+allowed_channel_id.join("> <#")+">")
      }
    }

    // Build model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        AnimalCrossingAccount: {
          name: null,
          island: null,
          hemisphere: null,
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
        hemisphere: null,
        title: null,
        comment: null,
        colour: null,
        photo: discord_avatar,
        friendCode: null
      })
    }

    let textMessage
    let search
    // Hemisphere
    search = /!hemisphere (?<hemisphere>[a-zA-Z]{1,})$/.exec(message.content)
    if (search!==null && search.groups.hemisphere!==undefined) {
      let lowercaseHemisphere = search.groups.hemisphere.toLowerCase()
      
      if (['north', 'nord', 'n'].includes(lowercaseHemisphere)) {
        user.AnimalCrossingAccount.hemisphere = 'n'
        textMessage = "merci ! Tu es donc dans **l'hémisphère Nord**."
      } else  {
        user.AnimalCrossingAccount.hemisphere = 's'
        textMessage = "merci ! Tu es donc dans **l'hémisphère Sud.**"
      }
    } else {
      if (user.AnimalCrossingAccount.name == null) {
        return message.reply("peux-tu me redonner ton **hemisphere** avec tes informations stp ?")
      }
    }

    user.save()
    user.AnimalCrossingAccount.save()

    return message.reply(textMessage)
  }
}