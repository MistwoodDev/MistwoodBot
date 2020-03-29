const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";
var farmingEmote = "<:farming:692026233227051029>";

module.exports.run = (bot, message, args) => {

    if (!args[1]) return message.channel.send(":x: **No arguments given**");
    else {
        switch (args[1].toLowerCase()) {
            case "player":
            case "p":
                fetch(config.API_ENDPOINT + "farming/players/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                    if (body.statusMessage) return message.channel.send(":x: **Couldn't find player with name \"" + args[2].toLowerCase() + "\"**");
                    var farmName = body.FarmName;
                    var name = body.Name;
                    var farmPermission = body.FarmPermission;
                    var id = body.ID;
                    var skin = "https://crafatar.com/renders/body/" + id.replace(/-/g, "") + ".png";
                    var embed = new Discord.RichEmbed()
                        .setTitle(mistwoodEmote + " Mistwood Farming | **" + args[2].toLowerCase() + "** " + farmingEmote)
                        .setColor(0x8AD61E)
                        .setThumbnail(skin)
                        .addField("Name:", name, true)
                        .addBlankField(true)
                        .addBlankField(true)
                        .addField("Farm Name:", farmName.replace("null", "Not in a farm"), true)
                        .addField("Farm Rank:", farmPermission.replace("null", "Not in a farm"), true)
                        .addBlankField(true)
                        .setFooter("ip here");
                    message.channel.send(embed);
                });
                break;
            case "farm":
            case "f":
                fetch(config.API_ENDPOINT + "farming/farms/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                    if (body.statusMessage) return message.channel.send(":x: **Couldn't find farm with name \"" + args[2].toLowerCase() + "\"**");
                    var name = body.Name;
                    var farmDate = body.Date;
                    var blocks = body.Info;
                    var ownerUUID = body.Owner;
                    var members = [];
                    for (i in body.Players) {
                        fetch("https://api.mojang.com/user/profiles/" + body.Players[i].replace(/-/g, "") + "/names").then(res => res.json()).then(body => {
                            members.push("- **" + body[0].name + "**");
                        });
                    }
                    fetch("https://api.mojang.com/user/profiles/" + ownerUUID.replace(/-/g, "") + "/names").then(res => res.json()).then(body => {
                        var ownerName = body[0].name;
                        //var icon = "";
                        var embed = new Discord.RichEmbed()
                            .setTitle(mistwoodEmote + " Mistwood Farming | **" + args[2].toLowerCase() + "** " + farmingEmote)
                            .setColor(0x8AD61E)
                            .addField("Farm Name:", name, true)
                            .addField("Farm Owner:", ownerName, true)
                            //.setThumbnail(icon)
                            .addBlankField(true)
                            .addField("Farm Area:", blocks + " blocks²", true)
                            .addField("Farm Created:", farmDate, true)
                            .addBlankField(true);
                        if (members.length === 0) members.push("No members in this farm");
                        embed.addField("Farm Members:", members.join("\n"), true)
                            .addBlankField(true)
                            .addBlankField(true)
                            .setFooter("ip here");
                        message.channel.send(embed);
                    });
                });
                break;
            default:
                break;
        }
    }
};

module.exports.help = {
    name: "farming",
    aliases: "f",
    description: "Fetch information about players or farms on the Farming server",
    usage: PREFIX + "farming <player/farm> <query>"
};