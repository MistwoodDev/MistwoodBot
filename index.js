const Discord = require("discord.js");
const clear = require("clear-console");
const fs = require("fs");
const config = require("./config/botConfig.json");


var bot = new Discord.Client();
var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";
var skyblockEmote = "<:skyblock:692026057490169917>";
var farmingEmote = "<:farming:692026233227051029>";



function coinflip(sides) {
    var result = Math.floor(Math.random() * sides);
    return result;
}


bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    var command = require(`./commands/${file}`);
    bot.commands.set(command.help.name, command);
}

process.on("uncaughtException", (err) => {
    console.log(err);
});
bot.on('warn', console.warn);
bot.on('error', console.error);
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
    bot.guilds.get("688532826940899440").channels.get("688540197692243968").setName("👥 Members: " + bot.guilds.get("688532826940899440").members.filter(member => !member.user.bot).size);
    bot.user.setActivity("for commands", { type: 'WATCHING' });
    bot.setInterval(function() {
        var types = [
            "WATCHING",
            "PLAYING"
        ];
        var activitiesWatching = [
            "over " + bot.users.filter(u => !u.bot).size + " users",
            "for commands"
        ];
        var activitiesPlaying = [
            "on Mistwood",
            PREFIX + "help"
        ];
        var activity = "";
        var type = types[coinflip(2)];
        if (type === "WATCHING") {
            activity = activitiesWatching[coinflip(2)];
        } else if (type === "PLAYING") {
            activity = activitiesPlaying[coinflip(2)];
        } else return bot.user.setActivity("for commands", { type: "WATCHING" });
        bot.user.setActivity(activity, { type: type });
    }, 10000);
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
    if (message.channel.type == "dm" || message.author.bot || message.author.id === bot.user.id) return;
    if (message.isMentioned(bot.user.id)) return message.channel.send(mistwoodEmote + " My prefix is `" + PREFIX + "`");
    if (!message.content.startsWith(PREFIX)) return;
    var args = message.content.slice(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        default: var commandFile = bot.commands.get(args[0].toLowerCase());
        if (commandFile) {
            commandFile.run(bot, message, args);
        } else {
            bot.commands.forEach(command => {
                for (i in command.help.aliases) {
                    if (command.help.aliases.split(";")[i] === args[0].toLowerCase()) command.run(bot, message, args);
                }
            });
        }
        break;
    }
});

bot.login(config.TOKEN);