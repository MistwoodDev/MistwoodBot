const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

function getStatus(ip, name) {
    fetch(config.STATUS_ENDPOINT + ip).then(res => res.json()).then(body => {
        var onlinePlayers = [];
        if (body.players) {
            if (body.players.list) {
                body.players.list.forEach(elem => {
                    onlinePlayers.push("- **" + elem + "**");
                });
            } else onlinePlayers.push("No players online");
        } else onlinePlayers.push("No players online");
        var online = "Offline :x:";
        if (body.online) online = "Online :white_check_mark:";
        var embed = new Discord.RichEmbed()
            .setTitle(mistwoodEmote + " Mistwood " + name + " Server | **Status**")
            .setColor(0x8AD61E)
            .addField("Status:", online, true)
            .setFooter(ip);
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
}

module.exports.run = (bot, message, args) => {
    if (!args[1]) return message.channel.send(":x: **No arguments given**\n**Usage:** " + PREFIX + "status <skyblock/farming>\n**Example(s):** " + PREFIX + "status farming**");
    switch (args[1].toLowerCase()) {
        case "skyblock":
            //getStatus("skyblockip", "Skyblock");
            break;
        case "farming":
            //getStatus("farmingip", "Farming");
            break;
        case "dev":
            getStatus("178.33.93.233:25575", "Dev");
            break;
        default:
            break;
    }
};

module.exports.help = {
    name: "status",
    aliases: "server",
    description: "Fetch status and the players online on the provided server",
    usage: PREFIX + "status <server>",
    hidden: false
};