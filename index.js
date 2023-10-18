import { config } from "dotenv"
import { Client, GatewayIntentBits, Routes, EmbedBuilder } from "discord.js"
import { REST } from "@discordjs/rest"
import mysql from "mysql";
import CfsCommand from "./cmds/confess.js"


config()
const TOKEN = process.env.BOT_TOKEN
const CID = process.env.CLIENT_ID
const GID = process.env.GUILD_ID
const BOT_CHANNEL = process.env.BOT_CHANNEL
const MOD_CHANNEL = process.env.MOD_CHANNEL
const GEN_CHANNEL = process.env.GEN_CHANNEL
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME


const talkedRecently = new Set();

const client = new Client({ intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

const rest = new REST({version: "10"}).setToken(TOKEN);

//initialize mysql connection.
const cdb = mysql.createPool({
    connectionLimit : 10,
    acquireTimeout  : 10000,
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 3306
});
cdb.getConnection(function(err){
    if (err){
        console.log(err);
    }
    else {
        console.log('DB connection success');
    }
});

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

let currentInsert;


client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) {

        if (talkedRecently.has(interaction.user.id)) {
                interaction.reply({
                    content: "you can confess again in 10 minutes.",
                    //this is the important part
                    ephemeral: true
                });
        } 
        else {
            const conf = interaction.options.get("confession").value
            //submits confession to db
            cdb.query(`INSERT INTO confessions (author, text) VALUES (${cdb.escape(interaction.user.username)} ,${cdb.escape(conf)})`, function(err, result, fields) {
                if (err) throw err;
                currentInsert = parseInt(result.insertId) + 1;
            });

            //sends confession to channel
            client.channels.cache.get(BOT_CHANNEL).send({ embeds: [
                new EmbedBuilder()
                    .setDescription(`"${conf}"`)
                    .setTitle(`Anonymous Confession #${currentInsert}`)
                    .setFooter({text: `🛑 Report abuse/misuse to the moderators | </> with 💜 by 🥭`})
                    .setColor("DarkPurple")
                    .setTimestamp()
            ] });

            //replies in client
            interaction.reply({
                content: "Your confession has been submitted.",
                ephemeral: true
            });

            // const anon = interaction.options.get("log").value

            // console.log(anon)
            
            //sends conf to mod channel for log
            // if (anon == true) {
            //     client.channels.cache.get(MOD_CHANNEL).send({ embeds: [
            //         new EmbedBuilder()
            //             .setDescription(`"${conf}"`)
            //             .setAuthor({name: interaction.user.username})
            //             .setTitle(`Confession #${currentInsert}`)
            //             .setFooter({text: `</> with 💜 by 🥭`})
            //             .setTimestamp()
            //             .setColor("DarkPurple")
            //     ] });
            // }

            
            
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(interaction.user.id);
            setTimeout(() => {
              // Removes the user from the set after 10 minutes
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