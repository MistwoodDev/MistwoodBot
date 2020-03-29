const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

module.exports.run = (bot, message, args) => {
    var embed = new Discord.RichEmbed()
        .setColor(0x8AD61E)
        .setThumbnail(message.guild.iconURL)
        .addField("Server name:", message.guild.name + " (" + message.guild.nameAcronym + ")", true)
        .addField("Server ID:", message.guild.id, true)
        .addBlankField(true)
        .addField("Server created at:", JSON.stringify(message.guild.createdAt).slice(1, 20).split("T"), true)
        .addField("Server Region:", message.guild.region, true)
        .addField("Members:", message.guild.members.filter(member => !member.user.bot).size + " members", true)
        .addField("Server owner: ", message.guild.owner.user.tag + " (" + message.guild.owner + ")", true)
        .addField("Server owner's ID: ", message.guild.ownerID, true)
        .addBlankField(true);
    message.channel.send(embed);
};

module.exports.help = {
    name: "id",
    aliases: "",
    description: "Get information about this Discord server",
    usage: PREFIX + "id"
};