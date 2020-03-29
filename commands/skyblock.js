const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

module.exports.run = (bot, message, args) => {
    fetch(config.API_ENDPOINT + "skyblock/players/" + args[1].toLowerCase()).then(res => res.json()).then(body => {
        if (body.statusMessage) return message.channel.send(":x: **Couldn't find player with name \"" + args[1].toLowerCase() + "\"**");
        var islandID = body.IslandID;
        var name = body.Name;
        var islandPermission = body.IslandPermission;
        var id = body.ID;
        var skin = "https://crafatar.com/renders/body/" + id.replace(/-/g, "") + ".png";
        var embed = new Discord.RichEmbed()
            .setTitle(mistwoodEmote + " Mistwood Skyblock | **" + args[1].toLowerCase() + "** " + skyblockEmote)
            .setColor(0x8AD61E)
            .addField("Name:", name, true)
            .addField("UUID:", id, true)
            .setThumbnail(skin)
            .addBlankField(true)
            .addField("Island ID:", islandID.replace("null", "Not in an island"), true)
            .addField("Island Rank:", islandPermission.replace("null", "Not in an island"), true)
            .addBlankField(true);
        return;
        message.channel.send(embed);
    });
};

module.exports.help = {
    name: "skyblock",
    aliases: "s",
    description: "Fetch information about players or islands on the Skyblock server",
    usage: PREFIX + "skyblock <player/island> <query>"
};