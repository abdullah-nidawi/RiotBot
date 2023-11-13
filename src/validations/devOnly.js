const {dev} = require("../cfg.json");

module.exports = (interaction, commandObj, handler, client) => {
	if (commandObj.devOnly) {
		if (interaction.member.id !== dev) {
			interaction.reply("This command is for the developer only ⛔");
			return true; // This must be added to stop the command from being executed.
		}
	}
};
