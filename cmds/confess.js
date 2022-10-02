import { SlashCommandBuilder } from "@discordjs/builders"
const cfsCommand = new SlashCommandBuilder()
    .setName("confess")
    .setDescription("Confess something anonymously")
    .addStringOption((option) => 
        option
        .setName("confession")
        .setDescription("type your confession...")
        .setRequired(true)
    )

export default cfsCommand.toJSON()