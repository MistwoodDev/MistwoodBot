const Discord = require("discord.js");
const clear = require("clear-console");
const config = require("./config/botConfig.json");

var bot = new Discord.Client();
var PREFIX = "m!";
var mistwoodEmote = "<:mistwood:688533711033073802>";

var rulesMessageID = "688538969692045389";

bot.on("ready", () => {
    clear({ toStart: true });
    console.log("\nMistwood Bot ready\n----------------------------");
});

bot.login(config.TOKEN);