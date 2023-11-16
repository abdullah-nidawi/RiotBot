const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Confessions = require("../../schemas/confessionsSchema");

module.exports = {

	// deleted: true,

	data: new SlashCommandBuilder()
		.setName("confess")
		.setDescription("Confess something anonymously!")
		.addStringOption((option) =>
			option
				.setName("confession")
				.setDescription("type your confession...?")
				.setRequired(true)),

	run: async ({ interaction, client, handler }) => {
		try {

			await interaction.deferReply({ ephemeral: true });

			let userProfile = await Confessions.findOne({
				userId: interaction.member.id,
			});

			if (!userProfile) {
				userProfile = new Confessions({
					userName: interaction.user.username,
					userId: interaction.member.id
				});
			}

			const conf = interaction.options.get("confession").value;

			const dbConf = {
				confText: conf,
				confDate: new Date(),
			};

			userProfile.confessions.push(dbConf);

			interaction.channel.send({
				embeds: [
					new EmbedBuilder()
						.setDescription(`"${conf}"`)
						.setTitle(`Anonymous Confession`)
						.setFooter({
							text: `🛑 Report abuse/misuse to the moderators | </> with 💜 by 🥭`,
						})
						.setColor("DarkPurple")
						.setTimestamp(),
				],
			});

			await userProfile.save();

			//replies in client
			interaction.editReply({
				content: "Your confession has been submitted.",
				ephemeral: true,
			});


		} catch (err) {
			console.log(`Error handling command /confess: ${err}`);
		}
	},

	inGuild: true
};
