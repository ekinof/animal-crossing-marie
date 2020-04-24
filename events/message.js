const passport = require("../commands/passport");

module.exports = (client, message) => {
  // console.log(message.content)
  if (message.content.startsWith("!passeport")) {
    return passport(message)
  }
}