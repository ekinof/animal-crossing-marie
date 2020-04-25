const passport = require("../commands/passport");
const vdb = require("../commands/vdb");

module.exports = (client, message) => {
  // console.log(message.content)
  if (message.content.startsWith("!passeport")) {
    return passport(message)
  }
  if (message.content.startsWith("!vdb")) {
    return vdb(message)
  }
}