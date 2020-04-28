const passport = require("../commands/passport");
const vdb = require("../commands/vdb");

module.exports = (client, message) => {
  // console.log(message.content)
  if (message.content.startsWith("!passeport")) {
    if (message.mentions.has(client.user)) { // If the bot is mentionned
      return message.reply("je n'ai pas à montrer mes papiers, je travaille ici.")
    } else {
      return passport(message)
    }
  }
  if (message.content.startsWith("!vdb")) {
    if (message.mentions.has(client.user)) { // If the bot is mentionned
      return message.reply("c'est gentil de penser à moi mais j'ai tout ce qu'il me faut déjà :relaxed:")
    } else {
      return vdb(message)
    }
  }
}