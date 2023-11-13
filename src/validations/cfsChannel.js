const { botChannel } = require("../cfg.json");

module.exports = async (interaction, commandObj, handler, client) => {
    if (commandObj.name === "confess") {
        if (interaction.channelId != botChannel) {
            interaction.reply({
                content: `This command is only available in <#${botChannel}>`,
            });
            return true;
        }
    }

};