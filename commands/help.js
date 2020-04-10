const Discord = require("discord.js");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";
var loadingEmote = "<a:loading:652730102584442891>";

module.exports.run = (bot, message, args) => {
    var commandName = "- Command list";
    if (args[1]) {
        let command = bot.commands.get(args[1].toLowerCase());
        if (command) {
            commandName = "- " + PREFIX + command.help.name;
        } else {
            bot.commands.forEach(command => {
                for (var i = 0; i != command.help.aliases.split(";").length; i++) {
                    if (command.help.aliases.split(";")[i] === args[1].toLowerCase()) commandName = "- " + PREFIX + command.help.name;
                }
            });
        }
    }
    var embed = new Discord.RichEmbed()
        .setTitle("**Mistwood Bot Help " + commandName + "**")
        .setColor(0x8AD61E)
        .setDescription("Legend: <required argument>, [optional argument]");
    if (args[1]) {
        if (isNaN(args[1])) {
            var command = bot.commands.get(args[1].toLowerCase());
            if (command) {
                embed.addField(PREFIX + command.help.name, command.help.description)
                    .addField("Usage: ", command.help.usage);
                if (command.help.aliases.length > 0) embed.addField("Aliases: ", command.help.aliases.split(";").join(", "));
            } else {
                bot.commands.forEach(command => {
                    if (commandName != undefined) {
                        for (var i = 0; i != command.help.aliases.length; i++) {
                            if (command.help.aliases.split(";")[i] === args[1].toLowerCase()) {
                                embed.addField(PREFIX + command.help.name, command.help.description)
                                    .addField("Usage: ", command.help.usage);
                                if (command.help.aliases.length > 0) embed.addField("Aliases: ", command.help.aliases.split(";").join(", "));
                            }
                        }
                    } else {
                        embed.setTitle("**Mistwood Bot Help - Command list**");
                        if (!command.help.hidden) embed.addField(PREFIX + command.help.name, command.help.description);
                    }
                });
            }
        } else {
            bot.commands.forEach(command => {
                embed.setTitle("**Mistwood Bot Help - Command list**");
                if (!command.help.hidden) embed.addField(PREFIX + command.help.name, command.help.description);
            });
        }
    } else {
        bot.commands.forEach(command => {
            embed.setTitle("**Mistwood Bot Help - Command list**");
            if (!command.help.hidden) embed.addField(PREFIX + command.help.name, command.help.description);
        });
    }
    message.channel.send(loadingEmote + " **Sending command list...**").then(loadingMessage => {
        message.author.send(embed).then(() => {
            loadingMessage.edit(":white_check_mark: **Sent command list. Check your DMs!**");
        });
    });
};

module.exports.help = {
    name: "help",
    aliases: "h;?",
    description: "Get the command list or info about a specified command",
    usage: PREFIX + "help [command]",
    hidden: false
};