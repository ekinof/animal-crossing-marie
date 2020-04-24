const { MessageEmbed } = require("discord.js")
let User = require('./models/user')

module.exports = message => {
  // check if there is an user who is mentioned
  // console.log(message.author)
  const member = message.mentions.members.first()
  if (member!==undefined) {
    const user = User.where({id: member.id}).first()
    if (user!==null) {
      return message.reply("J'ai trouvé l'utilisateur : "+user.name)
    } else {
      return message.reply("L'utilisateur n'a pas défini son profil.")
    }
  } else {
    // else it has to be the definition of parametters

    const userParams = {
      name: null,
      island: null,
      title: null,
      comment: null,
      colour: null,
      photo: null,
      friendCode: null,
    }

    // Name
    const search = /nom="(?<name>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.name!==undefined) {
      name = search.groups.name
    } else {
      return message.reply("Peux-tu me redonner ton nom avec tes informations ?")
    }

    // Island
    search = /ile="(?<island>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.island!==undefined) {
      island = search.groups.island
    } else {
      return message.reply("Je n'arrive pas à trouver ton ile...")
    }

    // Title
    search = /titre="(?<title>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if(search.groups.title!==undefined) {
        title = search.groups.title
      } else {
        return message.reply("Ton titre n'est pas bon.")
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.comment!==undefined) {
        comment = search.groups.comment
      } else {
        return message.reply("Ton commentaire n'est pas bon.")
      }
    }

    // Colour
    search = /couleur="(?<colour>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.colour!==undefined) {
        colour = search.groups.colour
      } else {
        return message.reply("Ta couleur n'est pas bonne.")
      }
    }

    // Photo
    search = /photo="(?<photo>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.photo!==undefined) {
        photo = search.groups.photo
      } else {
        return message.reply("Ta photo n'est pas bonne.")
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.friend_code!==undefined) {
      if (search.groups.friend_code!==undefined) {
        friendCode = search.groups.friend_code
      } else {
        return message.reply("Ton code ami n'est pas bonne.")
      }
    }

    if (name!==null && island!==null) {

      const user = new User(userParams)

      return message.reply("Dev de la sauvegarde en cours.")

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

        return message.reply(replyMessage);
    }
  }
}