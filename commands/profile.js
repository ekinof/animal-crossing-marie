const fs = require("fs")
const jimp = require("jimp")

module.exports = message => {
  // console.log(message.author)
  const member = message.mentions.members.first()
  if (member!==undefined) {
    if (fs.existsSync('./assets/images/profiles/'+member.id+'.png')) {
      fs.readFile('./assets/images/profiles/'+member.id+'.png', function (err, content) {
        if (!err) {
          return message.reply('Voici son profil', { files: ['./assets/images/profiles/'+member.id+'.png']})
        }
      });
    } else {
      return message.reply("L'utilisateur n'a pas défini son profil.")
    }
  } else {
    let userProperties = /^\!profile[ ]+nom="(?<name>[A-Za-zÀ-ÖØ-öø-ÿ]+)"[ ]+surnom="(?<surname>[A-Za-zÀ-ÖØ-öø-ÿ]+)"[ ]+ile="(?<island>[A-Za-zÀ-ÖØ-öø-ÿ]+)"/.exec(message.content)
    console.log(userProperties)
    if (userProperties!==null && userProperties.groups.name!==undefined && userProperties.groups.surname!==undefined && userProperties.groups.island!==undefined) {
      jimp.read('./assets/images/ACNH_Passport.png')
        .then(image => {
          jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font => {
            image.print(font, 230, -20, {text: userProperties.groups.name, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: jimp.VERTICAL_ALIGN_MIDDLE}, 32, 32)
            image.print(font, 290, 20, {text: userProperties.groups.surname, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: jimp.VERTICAL_ALIGN_MIDDLE}, 32, 32)
            image.print(font, 290, 75, {text: userProperties.groups.island, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: jimp.VERTICAL_ALIGN_MIDDLE}, 32, 32)

            image.writeAsync('./assets/images/profiles/'+message.author.id+'.png');
            return message.reply('Et voila !', { files: ['./assets/images/profiles/'+message.author.id+'.png']})
          })
        })
    }
  }
}