const { SlashCommandBuilder } = require("discord.js");
const UserSchema = require("../../Schemas/userSchema");


module.exports = {

    // deleted: true,

    data: new SlashCommandBuilder()
        .setName("givexp")
        .setDescription("Give xp to someone")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("who do you wanna give xp to?")
                .setRequired(true))
        .addNumberOption((option) =>
            option
                .setName("xp")
                .setDescription("how much xp?")
                .setRequired(true)),

    run: async ({ interaction, client }) => {
        await interaction.deferReply();

        const member = interaction.options.getUser("user");

        if (member.bot) {
            interaction.editReply({
                content: `You cannot give XP to bots dude! <:kyAMK:1172286653725945968>`
            });
            return;
        }

        const given_xp = interaction.options.getNumber("xp");


        let usr = await UserSchema.findOne({
            userId: member.id,
        });

        if (usr) {
            usr.xp += given_xp;
            await usr.save();
        }
        else {
            usr = new UserSchema({
                userName: interaction.options.getUser("user").username,
                userId: member.id,
                lastXp: new Date()
            });
            usr.xp += given_xp;
            await usr.save();
        }

        interaction.editReply({
            content: `Gave <@${member.id}> ${given_xp}XP!`
        });

    },

    devOnly: true,

    inGuild: true
};
