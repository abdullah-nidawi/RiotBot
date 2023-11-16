const { SlashCommandBuilder } = require("discord.js");
const Channels = require("../../schemas/channelSchema");

module.exports = {

    // deleted: true,

    data: new SlashCommandBuilder()
        .setName("setup-channels")
        .setDescription("Sets channels for rank updates and confessions")
        .addChannelOption((option) =>
            option
                .setName("confessions")
                .setDescription("select channel")
                .setRequired(true))
        .addChannelOption((option) =>
            option
                .setName("level-updates")
                .setDescription("select channel")
                .setRequired(true))

    ,

    run: async ({ interaction, client }) => {
        await interaction.deferReply();

        const conf = interaction.options.getChannel("confessions")
        const level = interaction.options.getChannel("level-updates")

        if (conf.type != 0 || level.type != 0) {
            interaction.editReply({
                content: "Please pick text channels only.",
                ephemeral: true
            });

            return;
        }

        let channels = new Channels({
            guildId: interaction.guild.id,
            cfsId: conf.id,
            rankId: level.id
        })

        await channels.save();
        interaction.editReply({
            content: `Confessions will be sent in <#${conf.id}> and level updates in <#${level.id}>`
        });

    },

    // devOnly: true,

    inGuild: true
};
