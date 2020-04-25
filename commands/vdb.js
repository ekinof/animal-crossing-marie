const {db, User, VillagerDB} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  // check if there is an user who is mentioned
  let user
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: VillagerDB })
    if (user==null || user.VillagerDB==null) {
      return message.reply("L'utilisateur n'a pas de lien VillagerDB de paramétré.")
    }
  } else {
    user = await User.findByPk(message.author.id, { include: VillagerDB })

    // Builde model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        VillagerDB: {
          url: null,
        }
       }, { 
        include: VillagerDB
      });
    }

    // Update or set user attributes
    user.username = message.author.username
    user.discriminator = message.author.discriminator
    user.avatar = message.author.avatar

    // If the AC Account of the user doesn't exists, we build it
    if (user.VillagerDB==undefined || user.VillagerDB==null) {
      user.VillagerDB = VillagerDB.build({
        userId: message.author.id,
        url: null,
      })
    }

    let search
    // URL
    search = /url="(?<url>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.url!==undefined) {
      user.VillagerDB.url = search.groups.url
    } else {
      if (user.VillagerDB.url == null) {
        return message.reply("Peux-tu me redonner l'URL de ton compte sur VillagerDB ?")
      }
    }

    user.save()
    user.VillagerDB.save()
  }

  return message.reply('Le lien du compte de '+user.username+' : '+user.VillagerDB.url)
}