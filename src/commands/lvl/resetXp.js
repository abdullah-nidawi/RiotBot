const { SlashCommandBuilder } = require("discord.js");
const Level = require("../../schemas/levelSchema");


module.exports = {

    // deleted: true,

    data: new SlashCommandBuilder()
        .setName("resetxp")
        .setDescription("Resets a member's xp to 0")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("who do you wanna reset?")
                .setRequired(true)),

    run: async ({ interaction, client }) => {
        await interaction.deferReply();
        const member = interaction.options.getUser("user");

        if (member.bot) {
            interaction.editReply({
                content: `Can't use this command on bots 💀.`
            });

            return;
        }

        let user = await Level.findOne({
            userId: member.id,
            guildId: interaction.guild.id
        });

        if (!user || user.xp == 0) {
            interaction.editReply({
                content: `Nah chill 💀.`
            });

            return;
        }

        user.xp = 0;
        user.level = 0;
        user.save();
        interaction.editReply({
            content: `<@${member.id}> Your rank has been reset 💀.`
        });
    },

    devOnly: true,

    inGuild: true
};
