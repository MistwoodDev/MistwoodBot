const Discord = require("discord.js");
const config = require("../config/botConfig.json");

var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

module.exports.run = (bot, message, args) => {
    if (args[1]) {
        let command = bot.commands.get(args[1].toLowerCase());
        if (command) {
            var commandName = "- " + PREFIX + command.help.name;
        } else {
            bot.commands.forEach(command => {
                for (i in command.help.aliases.split(";")) {
                    if (command.help.aliases.split(";")[i] === args[1].toLowerCase()) commandName = "- " + PREFIX + command.help.name;
                }
            });
        }
    } else var commandName = "- Command list";
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
                        for (i in command.help.aliases) {
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
    message.channel.send(embed);
};

module.exports.help = {
    name: "help",
    aliases: "h;?",
    description: "Get the command list or info about a specified command",
    usage: PREFIX + "help [command]",
    hidden: false
};