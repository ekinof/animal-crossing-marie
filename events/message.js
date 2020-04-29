const passport = require("../commands/passport");
const vdb = require("../commands/vdb");

module.exports = (client, message) => {
  if (process.env.DISCORD_SERVER_CHANNELS.includes(message.channel.id)) {
    return console.log(111)
    // console.log(message.content)
    if (message.content.startsWith("!passeport")) {
      if (message.mentions.has(client.user)) { // If the bot is mentionned
        message.reply("je n'ai pas à montrer mes papiers, je travaille ici.")
      } else {
        passport(message)
      }    
      return message.delete({ timeout: 500 })
    }
    if (message.content.startsWith("!vdb")) {
      if (message.mentions.has(client.user)) { // If the bot is mentionned
        message.reply("c'est gentil de penser à moi mais j'ai tout ce qu'il me faut déjà :relaxed:")
      } else {
        vdb(message)
      }
      return message.delete({ timeout: 500 })
    }
  }
}