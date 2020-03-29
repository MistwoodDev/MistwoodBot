const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

module.exports.run = (bot, message, args) => {
    if (!args[1]) return message.channel.send(":x: **No arguments given**\n**Usage:** " + PREFIX + "status <skyblock/farming>\n**Example(s):** " + PREFIX + "status farming**");
    switch (args[1].toLowerCase()) {
        case "skyblock":
            break;
        case "farming":
            break;
        case "dev":
            fetch(config.STATUS_ENPOINT + "178.33.93.233:25575").then(res => res.json()).then(body => {
                var onlinePlayers = [];
                if (body.players) {
                    if (body.players.list) {
                        body.players.list.forEach(elem => {
                            onlinePlayers.push("- **" + elem + "**");
                        });
                    } else onlinePlayers.push("No players online");
                } else onlinePlayers.push("No players online");
                if (body.online) var online = "Online :white_check_mark:";
                else online = "Offline :x:";
                var embed = new Discord.RichEmbed()
                    .setTitle(mistwoodEmote + " Mistwood Dev Server | **Status**")
                    .setColor(0x8AD61E)
                    .addField("Status:", online, true)
                    .setFooter("178.33.93.233:25575");
                if (body.online) {
                    embed.setDescription(body.motd.clean);
                }
                if (body.version && body.software) {
                    embed.addField("Version:", body.software + " " + body.version, true);
                    embed.addBlankField(true);
                }
                if (body.players) {
                    embed.addField("Players:", body.players.online + "/" + body.players.max, true);
                    embed.addBlankField(true);
                    embed.addBlankField(true);
                }
                if (body.players) {
                    embed.addField("Players online:", onlinePlayers.join("\n"), true);
                    embed.addBlankField(true);
                    embed.addBlankField(true);
                }
                message.channel.send(embed);
            });
            break;
        default:
            break;
    }
};

module.exports.help = {
    name: "status",
    aliases: "server",
    description: "Fetch status and the players online on the provided server",
    usage: PREFIX + "status <server>"
};