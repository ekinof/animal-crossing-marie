const profile = require("../commands/profile");

module.exports = (client, message) => {
  // console.log(message.content)
  if (message.content.startsWith("!profile")) {
    return profile(message)
  }
}