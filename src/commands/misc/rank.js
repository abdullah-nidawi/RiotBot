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
        .setDescription("See your current xp and level")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("who do you wanna reset?")
        ),

    run: async ({ interaction, client }) => {
        await interaction.deferReply();

        let member = interaction.user;
        let otherMember = interaction.options.getUser("user");

        if (otherMember) {
            member = otherMember;
        }

        if (member.bot) {
            interaction.editReply({
                content: `Bots don't have ranks dude! <:kyAMK:1172286653725945968>`
            });
            return;
        }

        let user = await UserSchema.findOne({
            userId: member.id,
        });

        if (!user) {
            user = new UserSchema({
                userId: member.id,
                userName: member.username
            });
            user.save();
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
