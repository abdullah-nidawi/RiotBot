const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const levelSchema = require("../../schemas/levelSchema");

let options = {
    notation: "compact",
    compactDisplay: "short",
};
function compact(number) {
    const usformatter = Intl.NumberFormat("en-US", options);
    return usformatter.format(number);
}

module.exports = {

    // deleted: true,

    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Server's leaderboard"),

    run: async ({ interaction, client }) => {


        await interaction.deferReply();

        let guildName = interaction.guild.name;
        guildName = guildName.charAt(0).toUpperCase() + guildName.slice(1);

        let allLevels = await levelSchema.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let desc = "";
        let title = "";
        let users = [];

        for (let i = 0; i < allLevels.length; i++) {
            let pos = i + 1;

            switch (pos) {
                case 1:
                    users.push(`**🥇** <@${allLevels[i].userId}> | **${compact(allLevels[i].xp)}**`);
                    break;
                case 2:
                    users.push(`**🥈** <@${allLevels[i].userId}> | **${compact(allLevels[i].xp)}**`);
                    break;
                case 3:
                    users.push(`**🥉** <@${allLevels[i].userId}> | **${compact(allLevels[i].xp)}**`);
                    break;

                default:
                    users.push(`**#${pos}.** <@${allLevels[i].userId}> | **${compact(allLevels[i].xp)}**`);
                    break;
            }

        }
        const usersSliced = users.slice(0, 15);
        title = `Top ${usersSliced.length} Members Ranked By XP`

        desc = usersSliced.join("\n");

        let lb = new EmbedBuilder()
            .setAuthor({ name: guildName, iconURL: interaction.guild.iconURL() })
            .setTitle(title)
            .setDescription(desc)
            .setFooter({
                text: `</> with 💜 by 🥭`,
            })
            .setColor("DarkPurple")
            .setTimestamp();


        interaction.editReply({
            embeds: [lb],
        });


    },

    // devOnly: true,

    inGuild: true
};
