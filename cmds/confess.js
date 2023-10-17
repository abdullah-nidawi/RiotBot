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
    .addBooleanOption((option) => 
        option
        .setName("log")
        .setDescription("Should I log?")
    )
    

export default cfsCommand.toJSON()