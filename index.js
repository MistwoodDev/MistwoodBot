const Discord = require("discord.js");
const clear = require("clear-console");
const fetch = require("node-fetch");
const config = require("./config/botConfig.json");


var bot = new Discord.Client();
var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

var rulesMessageID = "688538969692045389";



function coinflip(sides) {
    var result = Math.floor(Math.random() * sides);
    return result;
}



process.on("uncaughtException", (err) => {
    console.log(err);
});
bot.on("error", (err) => {
    console.log(err);
});
process.on("unhandledRejection", (err) => {
    console.log(err);
});



bot.on("guildMemberAdd", (member) => {
    member.guild.channels.get("688540197692243968").setName("👥 Members: " + member.guild.members.size);
    var playerRole = bot.guilds.get("688532826940899440").roles.get("688533140490289301");
    bot.channels.get("688537181786079240").fetchMessage("688538969692045389").then(rules => {
        rules.react("✅").then(() => {
            var checkFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id === member.user.id;
            var check = rules.createReactionCollector(checkFilter);
            check.on("collect", (reaction, collection) => {
                if (!member.roles.has(playerRole)) {
                    member.addRole(playerRole);
                }
                bot.channels.get("688537181786079240").fetchMessage("688538969692045389").then(message => {
                    message.reactions.first().remove(member.user.id);
                });
            });
        });
    });
});
bot.on("guildMemberRemove", (member) => {
    member.guild.channels.get("688540197692243968").setName("👥 Members: " + member.guild.members.size);
});
bot.on("ready", () => {
    clear({ toStart: true });
    console.log("\nMistwood Bot ready\n----------------------------");
    bot.guilds.get("688532826940899440").channels.get("688540197692243968").setName("👥 Members: " + bot.guilds.get("688532826940899440").members.size);
    bot.user.setActivity("for commands", { type: 'WATCHING' });
    bot.setInterval(function() {
        var types = [
            "WATCHING",
            "PLAYING"
        ];
        var activitiesWatching = [
            "over " + bot.users.size + " users",
            "for commands"
        ];
        var activitiesPlaying = [
            "on Mistwood",
            "with the settings"
        ];
        var activity = "";
        var type = types[coinflip(2)];
        if (type === "WATCHING") {
            activity = activitiesWatching[coinflip(3)];
        } else if (type === "PLAYING") {
            activity = activitiesPlaying[coinflip(2)];
        } else return console.log("Coinflip error");
        bot.user.setActivity(activity, { type: type });
    }, 15000);
});

bot.on("message", (message) => {
    if (message.isMentioned(bot.user.id)) return message.channel.send(mistwoodEmote + " My prefix is `" + PREFIX + "`");
    if (!message.content.startsWith(PREFIX)) return;
    var args = message.content.slice(PREFIX.length).split(" ");
    switch (args[0].toLowerCase()) {
        case "info":
            if (!args[1]) return message.channel.send(":x: **No arguments given**\n**Usage:** " + PREFIX + "info <skyblock/farming> <playerName>\n**Example(s):** " + PREFIX + "info farming fried_fetus69\n                        " + PREFIX + "info skyblock fried_fetus69");
            else {
                if (!args[2]) return message.channel.send(":x: **No player name given**");
                else {
                    switch (args[1].toLowerCase()) {
                        case "skyblock":
                        case "s":
                            fetch(config.API_ENDPOINT + "skyblock/players/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                                if (body.statusMessage) return message.channel.send(":x: **Couldn't find player with name \"" + args[2].toLowerCase() + "\"**");
                                var islandID = body.IslandID;
                                var name = body.Name;
                                var islandPermission = body.IslandPermission;
                                var id = body.ID;
                                var skin = "https://crafatar.com/renders/body/" + id.replace(/-/g, "") + ".png";
                                var embed = new Discord.RichEmbed()
                                    .setTitle(mistwoodEmote + " Mistwood Skyblock | **" + args[2].toLowerCase() + "**")
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
                            break;
                        case "farming":
                        case "f":
                            fetch(config.API_ENDPOINT + "farming/players/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                                if (body.statusMessage) return message.channel.send(":x: **Couldn't find player with name \"" + args[2].toLowerCase() + "\"**");
                                var farmID = body.FarmID;
                                var name = body.Name;
                                var farmPermission = body.FarmPermission;
                                var id = body.ID;
                                var skin = "https://crafatar.com/renders/body/" + id.replace(/-/g, "") + ".png";
                                var embed = new Discord.RichEmbed()
                                    .setTitle(mistwoodEmote + " Mistwood Farming | **" + args[2].toLowerCase() + "**")
                                    .setColor(0x8AD61E)
                                    .addField("Name:", name, true)
                                    .addField("UUID:", id, true)
                                    .setThumbnail(skin)
                                    .addBlankField(true)
                                    .addField("Farm ID:", farmID.replace("null", "Not in a farm"), true)
                                    .addField("Farm Rank:", farmPermission.replace("null", "Not in a farm"), true)
                                    .addBlankField(true)
                                    .setFooter("ip here");
                                message.channel.send(embed);
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case "status":
            if (!args[1]) return message.channel.send(":x: **No arguments given**\n**Usage:** " + PREFIX + "status <skyblock/farming>\n**Example(s):** " + PREFIX + "status farming**");
            switch (args[1].toLowerCase()) {
                case "skyblock":
                    break;
                case "farming":
                    break;
                case "dev":
                    fetch(config.STATUS_ENPOINT + "178.33.93.233:25575").then(res => res.json()).then(body => {
                        var onlinePlayers = [];
                        if (body.players.list) {
                            body.players.list.forEach(elem => {
                                onlinePlayers.push("- **" + elem + "**");
                            });
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
            break;
        case "id":
            var embed = new Discord.RichEmbed()
                .setColor(0x8AD61E)
                .setThumbnail(message.guild.iconURL)
                .addField("Server name:", message.guild.name + " (" + message.guild.nameAcronym + ")", true)
                .addField("Server ID:", message.guild.id, true)
                .addBlankField(true)
                .addField("Server created at:", JSON.stringify(message.guild.createdAt).slice(1, 20).split("T"), true)
                .addField("Server Region:", message.guild.region, true)
                .addField("Members:", message.guild.memberCount + " members", true)
                .addField("Server owner: ", message.guild.owner.user.tag + " (" + message.guild.owner + ")", true)
                .addField("Server owner's ID: ", message.guild.ownerID, true)
                .addBlankField(true);
            message.channel.send(embed);
            break;
        default:
            break;
    }
});

bot.login(config.TOKEN);