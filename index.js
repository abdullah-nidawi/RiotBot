import { config } from "dotenv"
import { Client, GatewayIntentBits, Routes, EmbedBuilder } from "discord.js"
import { REST } from "@discordjs/rest"
// import mongoose from "mongoose"
import CfsCommand from "./cmds/confess.js"

config()
const TOKEN = process.env.BOT_TOKEN
const CID = process.env.CLIENT_ID
const GID = process.env.GUILD_ID
const MONGO = process.env.URI
const BOT_CHANNEL = process.env.BOT_CHANNEL
const MOD_CHANNEL = process.env.MOD_CHANNEL

const talkedRecently = new Set();

const client = new Client({ intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

const rest = new REST({version: "10"}).setToken(TOKEN)
client.on("ready", async () => {
    // await mongoose.connect(
    //     MONGO || "", 
    //     {keepAlive:true}
    // )
    console.log(`Logged in as ${client.user.tag}`)
})

// var id = 1

client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) {

        if (talkedRecently.has(interaction.user.id)) {
                // interaction.user.send("You must wait 10 minutes before using the bot again.");
                interaction.reply({
                    content: "you can confess again in 10 minutes.",
                    //this is the important part
                    ephemeral: true
                });
        } 
        else {
            const conf = interaction.options.get("confession").value
            // console.log(interaction.user.id)
            //replies in client
            interaction.reply({
                content: "Your confession has been submitted.",
                ephemeral: true
            });
            //sends confession to channel
            client.channels.cache.get(BOT_CHANNEL).send({ embeds: [
                new EmbedBuilder()
                    .setDescription(`"${conf}"`)
                    .setTitle(`Anonymous Confession`)
                    .setFooter({text: `❗ If this is ToS-breaking or overtly hateful, report it to the moderators | Made with 💜 by Mango`})
                    .setColor("DarkPurple")
                    .setTimestamp()
            ] });
            //sends confession to mods
            client.channels.cache.get(MOD_CHANNEL).send({ embeds: [
                new EmbedBuilder()
                    .setDescription(`"${conf}"`)
                    .setAuthor({name: interaction.user.tag})
                    .setTitle(`Confessed:`)
                    .setFooter({text: `Made with 💜 by Mango`})
                    .setTimestamp()
                    .setColor("DarkPurple")
            ] });
            // id++
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(interaction.user.id);
            setTimeout(() => {
              // Removes the user from the set after a minute
              talkedRecently.delete(interaction.user.id);
            }, 600000);
        }
    }
})

async function main() {

    

    const commands= [CfsCommand]
    try {
        console.log("Started refreshing application (/) commands.")
        await rest.put(Routes.applicationGuildCommands(CID,GID), {
            body: commands
        })
        client.login(TOKEN)
    }
    catch(err){
        console.log(err)
    }
}

main()