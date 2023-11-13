const { SlashCommandBuilder } = require("discord.js");

module.exports = {

	// deleted: true,

	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Pong!"),

	run: ({ interaction, client }) => {
		interaction.reply(`Pong! ${client.ws.ping}ms`);
	},

	devOnly: true,

	inGuild: true
};
