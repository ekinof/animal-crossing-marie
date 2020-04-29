const {db, User, VillagerDB} = require ('../models') 
const { MessageEmbed } = require("discord.js")

module.exports = async message => {
  // Allowed channel ID
  let channel_id = '705041769791881252'

  // check if there is an user who is mentioned
  let user
  const member = message.mentions.members.first()
  if (member!==undefined) {
    user = await User.findByPk(member.id, { include: VillagerDB })
    if (user==null || user.VillagerDB==null) {
      return message.reply("l'utilisateur-trice n'a pas de lien **VillagerDB** de paramétré.")
    }
    
    return message.reply('voici le compte **VillagerDB** de '+user.username+' : https://villagerdb.com/user/'+user.VillagerDB.username)
  } else {
    user = await User.findByPk(message.author.id, { include: VillagerDB })

    // Build model if it doesn't exist
    if (user == null) {
      user = User.build({
        id: message.author.id,
        VillagerDB: {
          userId: message.author.id,
          username: null,
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
        username: null,
      })
    }

    let search
    // Username
    search = /!vdb (?<username>[a-z]+)$/.exec(message.content)
    if (search!==null && search.groups.username!==undefined) {
      user.VillagerDB.username = search.groups.username
    } else {
      if (user.VillagerDB.username == null) {
        return message.reply('peux-tu me redonner ton **Nom** sur VillagerDB ?')
      }
    }

    user.save()
    user.VillagerDB.save()

    search = /!vdb ([a-z]+)/.exec(message.content)
    if (search !==null && message.channel.id !== channel_id) { // if edit profil in non allowed channel
      return message.reply('tu ne peux éditer ton profil que dans le salon <#'+channel_id+'>')
    } else { // else
      return message.reply('voici ton compte **VillagerDB** : https://villagerdb.com/user/'+user.VillagerDB.username)
    }
  }
}