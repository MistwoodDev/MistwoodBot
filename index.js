const Discord = require("discord.js");
const clear = require("clear-console");
const fetch = require("node-fetch");
const config = require("./config/botConfig.json");


var bot = new Discord.Client();
var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";
var skyblockEmote = "<:skyblock:692026057490169917>";
var farmingEmote = "<:farming:692026233227051029>";

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
});
bot.on("guildMemberRemove", (member) => {
    member.guild.channels.get("688540197692243968").setName("👥 Members: " + member.guild.members.size);
});

bot.on("raw", packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = bot.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
        }
    });
});

bot.on("messageReactionAdd", (reaction, user) => {
    var skyblockRole = bot.guilds.get("688532826940899440").roles.get("688673937496080421");
    var farmingRole = bot.guilds.get("688532826940899440").roles.get("688673855413551144");
    var notificationsRole = bot.guilds.get("688532826940899440").roles.get("692048211535200266");
    switch (reaction.message.id) {
        case "692051088286679051":
            switch (reaction.emoji.id) {
                case "692026057490169917":
                    var guildMember = bot.guilds.get("688532826940899440").members.get(reaction.users.last().id);
                    if (!guildMember.roles.has(skyblockRole)) {
                        guildMember.addRole(skyblockRole);
                        user.send(mistwoodEmote + " Gave you the **Skyblock** role!" + skyblockEmote);
                    }
                    break;
                case "692026233227051029":
                    guildMember = bot.guilds.get("688532826940899440").members.get(reaction.users.last().id);
                    if (!guildMember.roles.has(farmingRole)) {
                        guildMember.addRole(farmingRole);
                        user.send(mistwoodEmote + " Gave you the **Farming** role! " + farmingEmote);
                    }
                    break;
                default:
                    switch (reaction.emoji.name) {
                        case "🔔":
                            guildMember = bot.guilds.get("688532826940899440").members.get(reaction.users.last().id);
                            if (!guildMember.roles.has(notificationsRole)) {
                                guildMember.addRole(notificationsRole);
                                user.send(mistwoodEmote + " Gave you the **Notifications** role! 🔔");
                            }
                            break;
                        default:
                            bot.channels.get("692024614301466665").fetchMessage("692051088286679051").then(message => {
                                message.reactions.last().remove(reaction.users.last().id);
                            });
                            break;
                    }
                    break;
            }
            break;
        case "688538969692045389":
            switch (reaction.emoji.name) {
                case "✅":
                    var playerRole = bot.guilds.get("688532826940899440").roles.get("688533140490289301");
                    var guildMember = bot.guilds.get("688532826940899440").members.get(reaction.users.last().id);
                    if (!guildMember.roles.has(playerRole)) {
                        guildMember.addRole(playerRole);
                    }
                    bot.channels.get("688537181786079240").fetchMessage("688538969692045389").then(message => {
                        message.reactions.first().remove(reaction.users.last().id);
                    });
                    break;
                default:
                    bot.channels.get("688537181786079240").fetchMessage("688538969692045389").then(message => {
                        message.reactions.last().remove(reaction.users.last().id);
                    });
                    break;
            }
            break;
        default:
            break;
    }
});

bot.on("messageReactionRemove", (reaction, user) => {
    var skyblockRole = bot.guilds.get("688532826940899440").roles.get("688673937496080421");
    var farmingRole = bot.guilds.get("688532826940899440").roles.get("688673855413551144");
    var notificationsRole = bot.guilds.get("688532826940899440").roles.get("692048211535200266");
    switch (reaction.message.id) {
        case "692051088286679051":
            switch (reaction.emoji.id) {
                case "692026057490169917":
                    var guildMember = bot.guilds.get("688532826940899440").members.get(user.id);
                    if (!guildMember.roles.has(skyblockRole)) {
                        guildMember.removeRole(skyblockRole);
                        user.send(mistwoodEmote + " Removed the **Skyblock** role! " + skyblockEmote);
                    }
                    break;
                case "692026233227051029":
                    guildMember = bot.guilds.get("688532826940899440").members.get(user.id);
                    if (!guildMember.roles.has(farmingRole)) {
                        guildMember.removeRole(farmingRole);
                        user.send(mistwoodEmote + " Removed the **Farming** role! " + farmingEmote);
                    }
                    break;
                default:
                    switch (reaction.emoji.name) {
                        case "🔔":
                            guildMember = bot.guilds.get("688532826940899440").members.get(user.id);
                            if (!guildMember.roles.has(notificationsRole)) {
                                guildMember.removeRole(notificationsRole);
                                user.send(mistwoodEmote + " Removed the **Notifications** role! 🔔");
                            }
                            break;
                    }
                    break;
            }
            break;
        default:
            break;
    }
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
    // var embed = new Discord.RichEmbed()
    //     .setTitle(mistwoodEmote + " Mistwood | **Roles**")
    //     .setDescription("React with the corresponding emote below to obtain the role and access other channels!")
    //     .setThumbnail("https://cdn.clipart.email/e79d15c23ca160e80ddf4bf2c6e90c80_clip-art-trees-clip-art-trees-trees-tree-clipart-free-clipart-_710-749.png")
    //     .setColor(0x8AD61E)
    //     .addField(skyblockEmote, "Skyblock", true)
    //     .addField(farmingEmote, "Farming", true)
    //     .addField("🔔", "Notifications", true)
    // bot.channels.get("692024614301466665").send(embed).then(rolesEmbed => {
    //     rolesEmbed.react("692026057490169917").then(() => {
    //         rolesEmbed.react("692026233227051029").then(() => {
    //             rolesEmbed.react("🔔");
    //         });
    //     });
    // });
});

bot.on("message", (message) => {
    if (message.isMentioned(bot.user.id)) return message.channel.send(mistwoodEmote + " My prefix is `" + PREFIX + "`");
    if (!message.content.startsWith(PREFIX)) return;
    var args = message.content.slice(PREFIX.length).split(" ");
    switch (args[0].toLowerCase()) {
        case "skyblock":
        case "s":
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
            break;
        case "farming":
        case "f":
            if (!args[1]) return message.channel.send(":x: **No arguments given**");
            else {
                switch (args[1].toLowerCase()) {
                    case "player":
                    case "p":
                        fetch(config.API_ENDPOINT + "farming/players/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                            if (body.statusMessage) return message.channel.send(":x: **Couldn't find player with name \"" + args[2].toLowerCase() + "\"**");
                            var farmID = body.FarmID;
                            var name = body.Name;
                            var farmPermission = body.FarmPermission;
                            var id = body.ID;
                            var skin = "https://crafatar.com/renders/body/" + id.replace(/-/g, "") + ".png";
                            var embed = new Discord.RichEmbed()
                                .setTitle(mistwoodEmote + " Mistwood Farming | **" + args[2].toLowerCase() + "** " + farmingEmote)
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
                    case "farm":
                    case "f":
                        fetch(config.API_ENDPOINT + "farming/farms/" + args[2].toLowerCase()).then(res => res.json()).then(body => {
                            if (body.statusMessage) return message.channel.send(":x: **Couldn't find farm with name \"" + args[2].toLowerCase() + "\"**");
                            var farmID = body.FarmID;
                            var name = body.Name;
                            var farmPermission = body.FarmPermission;
                            var ownerUUID = body.Owner.replace(/-/g, "");
                            var members = [];
                            for (i in body.Players) {
                                fetch("https://api.mojang.com/user/profiles/" + body.Players[i].replace(/-/g, "") + "/names").then(res => res.json()).then(body => {
                                    members.push("- **" + body[0].name + "**");
                                });
                            }
                            fetch("https://api.mojang.com/user/profiles/" + ownerUUID + "/names").then(res => res.json()).then(body => {
                                var ownerName = body[0].name;
                                //var icon = "";
                                var embed = new Discord.RichEmbed()
                                    .setTitle(mistwoodEmote + " Mistwood Farming | **" + args[2].toLowerCase() + "** " + farmingEmote)
                                    .setColor(0x8AD61E)
                                    .addField("Name:", name, true)
                                    .addField("Owner:", ownerName, true)
                                    //.setThumbnail(icon)
                                    .addBlankField(true)
                                    .addField("Farm ID:", farmID.replace("null", "Not in a farm"), true)
                                    .addField("Farm Rank:", farmPermission.replace("null", "Not in a farm"), true)
                                    .addBlankField(true)
                                    .addField("Farm Members:", members.join("\n"), true)
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