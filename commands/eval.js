const { inspect } = require("util");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

module.exports.run = (bot, message, args) => {
    if (message.author.id != "375485987893149696") return;
    let code = args.slice(1).join(" ");
    let regex = new RegExp(config.TOKEN, "gi");
    try {
        let evaled = inspect(eval(code));
        let MAX_CHARS = evaled.length + 8;
        if (MAX_CHARS > 2000) {
            return message.channel.send("Output message exceeded 2000 characters limit. Exported to attached file", {
                files: [{
                    attachment: Buffer.from(evaled.replace(regex, "secret")),
                    name: "output.txt"
                }]
            })
        } else return message.channel.send(evaled.replace(regex, "secret"), { code: "js" });
    } catch (e) {
        message.channel.send("Error evaluating code: \n```bash\n" + e + "\n```");
    }
};

module.exports.help = {
    name: "eval",
    aliases: "e",
    description: "Evaluate a JavaScript code and execute it",
    usage: PREFIX + "eval <code>",
    hidden: true
};