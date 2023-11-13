const { SlashCommandBuilder } = require("discord.js");
const UserSchema = require("../../schemas/userSchema");


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

        let user = await UserSchema.findOne({
            userId: member.id,
        });

        if (!user) {
            user = new UserSchema({
                userId: member.id,
                userName: member.username
            });
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
