const Discord = require("discord.js");
const clear = require("clear-console");
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
});

bot.login(config.TOKEN);