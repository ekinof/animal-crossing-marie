const {db, User, AnimalCrossingAccount} = require ('../models') 

module.exports = message => {
  // check if there is an user who is mentioned
  // console.log(message.author)
  const member = message.mentions.members.first()
  if (member!==undefined) {
    const user = User.find(member.id)
    if (user!==null && user.animalCrossingAccount!==null) {
      return message.reply("J'ai trouvé l'utilisateur : "+user.username)
    } else {
      return message.reply("L'utilisateur n'a pas défini son profil.")
    }
  } else {
    // else it has to be the definition of parametters

    const userParams = {
      id: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator,
      avatar: message.author.avatar,
      animalCrossingAccount : {
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
      userParams.animalCrossingAccount.name = search.groups.name
    } else {
      return message.reply("Peux-tu me redonner ton nom avec tes informations ?")
    }

    // Island
    search = /ile="(?<island>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.island!==undefined) {
      userParams.animalCrossingAccount.island = search.groups.island
    } else {
      return message.reply("Je n'arrive pas à trouver ton ile...")
    }

    // Title
    search = /titre="(?<title>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if(search.groups.title!==undefined) {
        userParams.animalCrossingAccount.title = search.groups.title
      } else {
        return message.reply("Ton titre n'est pas bon.")
      }
    }

    // Comment
    search = /commentaire="(?<comment>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.comment!==undefined) {
        userParams.animalCrossingAccount.comment = search.groups.comment
      } else {
        return message.reply("Ton commentaire n'est pas bon.")
      }
    }

    // Colour
    search = /couleur="(?<colour>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.colour!==undefined) {
        userParams.animalCrossingAccount.colour = search.groups.colour
      } else {
        return message.reply("Ta couleur n'est pas bonne.")
      }
    }

    // Photo
    search = /photo="(?<photo>[^"]+)"/.exec(message.content)
    if (search!==null) {
      if (search.groups.photo!==undefined) {
        userParams.animalCrossingAccount.photo = search.groups.photo
      } else {
        return message.reply("Ta photo n'est pas bonne.")
      }
    }

    // Friend Code
    search = /code-ami="(?<friend_code>[^"]+)"/.exec(message.content)
    if (search!==null && search.groups.friend_code!==undefined) {
      if (search.groups.friend_code!==undefined) {
        userParams.animalCrossingAccount.friendCode = search.groups.friend_code
      } else {
        return message.reply("Ton code ami n'est pas bonne.")
      }
    }

    return User.create(userParams, {include: {model: AnimalCrossingAccount, as: 'animalCrossingAccount'}})
  }

  return message.reply(user.getPassport());
}