const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const canvacord = require('canvacord');
const levelSchema = require("../../schemas/levelSchema");
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

        let target = interaction.options.getUser("user")

        let member = target || interaction.user;


        if (member.bot) {
            interaction.editReply({
                content: `Bots don't have ranks <:kyAMK:1172286653725945968>`
            });
            return;
        }

        let fetchedLevel = await levelSchema.findOne({
            userId: member.id,
            guildId: interaction.guild.id
        });

        if (!fetchedLevel || fetchedLevel.xp == 0) {
            interaction.editReply(
                target ?
                    `<@${target.id}> has to get some XP first 💀.`
                    : "You have to get some XP first 💀."
            );

            return;
        }

        let allLevels = await levelSchema.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === member.id) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setRankColor("#94ffda")
            .setLevel(fetchedLevel.level)
            .setLevelColor("#94ffda")
            .setCurrentXP(fetchedLevel.xp, '#f9cfff')
            .setRequiredXP(levelXP(fetchedLevel.level), '#f9cfff')
            .setProgressBar(['#f9cfff', '#ea5592'], 'GRADIENT')
            .setUsername(member.username)
            .setCustomStatusColor("#fff")

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });


        // interaction.editReply({
        //     // content: `<@${member.id}> you have ${user.xp} XP & you're level ${user.level}`,
        //     embeds: [
        //         new EmbedBuilder()
        //             .setTitle(`${member.username}'s rank:`)
        //             .setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png `)
        //             .addFields(
        //                 { name: 'Current XP', value: `${user.xp}`, inline: true },
        //                 { name: 'Current level', value: `${user.level}`, inline: true },
        //                 { name: 'Xp to level-up', value: `${levelXP(user.level) - user.xp}`, inline: true },

        //             )
        //             .setFooter({
        //                 text: `</> with 💜 by 🥭`,
        //             })
        //             .setColor("DarkPurple")
        //             .setTimestamp(),
        //     ],
        // });

    },

    // devOnly: true,

    inGuild: true
};
