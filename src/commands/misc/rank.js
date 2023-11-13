const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const UserSchema = require("../../schemas/userSchema");
const { x, y } = require("../../cfg.json");

let levelXP = (lvl) => {
    const r = Math.floor((lvl / x) ** y + 100);
    return r;
}

module.exports = {

    // deleted: true,

    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("See your current xp and level"),

    run: async ({ interaction, client }) => {
        await interaction.deferReply();
        const member = interaction.user;

        let user = await UserSchema.findOne({
            userId: member.id,
        });

        if (!user) {
            user = new UserSchema({
                userId: member.id,
                userName: member.username
            });
        }

        interaction.editReply({
            // content: `<@${member.id}> you have ${user.xp} XP & you're level ${user.level}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.username}'s rank:`)
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png `)
                    .addFields(
                        { name: 'Current XP', value: `${user.xp}`, inline: true },
                        { name: 'Current level', value: `${user.level}`, inline: true },
                        { name: 'Xp to level-up', value: `${levelXP(user.level) - user.xp}`, inline: true },

                    )
                    .setFooter({
                        text: `</> with 💜 by 🥭`,
                    })
                    .setColor("DarkPurple")
                    .setTimestamp(),
            ],
        });

    },

    // devOnly: true,

    inGuild: true
};
