const { SlashCommandBuilder } = require("discord.js");
const LevelSchema = require("../../schemas/levelSchema");
const { levelUpChannel, x, y } = require("../../cfg.json");

let levelXP = (lvl) => {
    const r = Math.floor((lvl / x) ** y + 100);
    return r;
}

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


        let usr = await LevelSchema.findOne({
            userId: member.id,
            guildId: interaction.guild.id
        });

        if (!usr) {
            interaction.editReply({
                content: `<@${member.id}> has to chat a bit first 💀`
            });
            return;
        }

        usr.xp += given_xp;

        let j = usr.level;
        if (levelXP(usr.level) < usr.xp) {

            do {
                j++;
            }
            while (levelXP(j) < usr.xp);
            usr.level = j;
            interaction.channel.send({
                content: `Congrats <@${member.id}>! You advanced to **level ${usr.level}** 🎉`
            });
            // client.channels.cache.get(levelUpChannel).send({
            //     content: `Congrats <@${member.id}>! You advanced to **level ${usr.level}** 🎉`
            // })
        }

        await usr.save();

        interaction.editReply({
            content: `Gave <@${member.id}> ${given_xp}XP!`
        });

    },

    devOnly: true,

    inGuild: true
};
