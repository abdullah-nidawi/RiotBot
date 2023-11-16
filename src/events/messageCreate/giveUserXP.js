const levelSchema = require("../../schemas/levelSchema");
const Channels = require("../../schemas/channelSchema");
const { x, y } = require("../../cfg.json");
const client = require("../../index")
const cooldowns = new Set();



let levelXP = (lvl) => {
    const r = Math.floor((lvl / x) ** y + 100);
    return r;
}
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = async (message) => {

    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const msgXp = randomIntegerInRange(15, 25);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id
    };

    try {

        let usr = await levelSchema.findOne(query);

        let guildChannels = await Channels.findOne({
            guildId: message.guild.id
        });

        if (!usr) {
            usr = new levelSchema({
                userId: message.author.id,
                guildId: message.guild.id,
                userName: message.author.username,
                xp: msgXp
            });

            await usr.save();

            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);

            return;

        }

        usr.xp += msgXp;

        if (!guildChannels) {
            await usr.save();
            return;
        }

        let j = usr.level;
        if (levelXP(usr.level) < usr.xp) {
            do {
                j++;
            }
            while (levelXP(j) < usr.xp);

            usr.level = j;

            client.channels.cache.get(guildChannels.rankId).send({
                content: `Congrats <@${message.author.id}>! You advanced to **level ${usr.level}** 🎉`
            })
        }

        // console.log(`usr.xp: ${usr.xp}`);
        // console.log(`usr.level: ${usr.level}`);
        // console.log(`next level: ${levelXP(usr.level) - usr.xp}`);


        await usr.save();

        cooldowns.add(message.author.id);
        setTimeout(() => {
            cooldowns.delete(message.author.id);
        }, 60000);

    }
    catch (err) {
        console.log(`Error giving message XP to member ${err}`)
    }

}

