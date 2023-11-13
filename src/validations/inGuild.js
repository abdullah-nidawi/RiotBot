module.exports = async (interaction, commandObj, handler, client) => {
    if (commandObj.inGuild) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command must be executed within a server 🤡",
                ephemeral: true,
            });
            return true;
        }
    }

};