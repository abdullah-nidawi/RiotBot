require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const path = require("path");
const { CommandHandler } = require("djs-commander");
const { testServer } = require("./cfg.json");
const mongoose = require("mongoose");

//env imports
const TOKEN = process.env.BOT_TOKEN;
const MGDB = process.env.MGDB_URI;

//init client obj
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

//init cmdHandler
new CommandHandler({
	client,
	commandsPath: path.join(__dirname, "commands"),
	eventsPath: path.join(__dirname, "events"),
	validationsPath: path.join(__dirname, "validations"),
	// testServer,
});

(async () => {
	mongoose.set("strictQuery", false);
	await mongoose.connect(MGDB);

	console.log("Connected to DB ✅");

	client.login(TOKEN);
})();
