const Channels = require("../schemas/channelSchema");

module.exports = async (interaction, commandObj, handler, client) => {
    if (commandObj.name === "rank" || commandObj.name === "givexp" || commandObj.name === "leaderboard") {

        let guildChannels = await Channels.findOne({
            guildId: interaction.guild.id
        });

        if (!guildChannels) {
            interaction.reply({
                content: `Use /setup-channels first to assign a channel for this command.`,
            });
            return true;
        }
        else if (interaction.channelId != guildChannels.rankId) {
            interaction.reply({
                content: `This command is only available in <#${guildChannels.rankId}>`,
            });
            return true;
        }

    }

};