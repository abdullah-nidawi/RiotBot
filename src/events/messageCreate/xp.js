const UserSchema = require("../../Schemas/userSchema");

//calculates how much xp for next level
let xpDiff = (userXp, userLvl) => {
    const r = Math.floor((userLvl / 0.35) ** 2.5) - userXp;
    return r;
}

let levelXP = (lvl) => {
    const r = Math.floor((lvl / 0.35) ** 2.5);
    return r;
}


module.exports = async (message) => {

    const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const msgXp = randomIntegerInRange(12, 20);

    if (message.author.bot) return;

    let usr = await UserSchema.findOne({
        userId: message.author.id,
    });

    if (!usr) {
        usr = new UserSchema({
            userName: message.author.username,
            userId: message.author.id,
            lastXp: new Date()
        });
        await usr.save();
    }
    else if (usr && !usr.lastXp) {
        usr.lastXp = new Date();
        await usr.save();
    }

    const currentDate = new Date();
    const delta = Math.floor(Math.abs(usr.lastXp - currentDate) / 1000);

    // console.log(`delta: ${delta}`);

    if (delta > 60 || true) {
        usr.xp += msgXp;
        usr.lastXp = new Date();

        let j = usr.level;
        if (levelXP(usr.level) < usr.xp) {

            do {
                j++;
            }
            while (levelXP(j) < usr.xp);
            usr.level = j;
            message.channel.send({
                content: `Congrats <@${message.author.id}>! You advanced to **level ${usr.level}** 🎉`
            })
        }

        // console.log(`usr.xp: ${usr.xp}`);
        // console.log(`usr.level: ${usr.level}`);
        // console.log(`next level: ${xpDiff(usr.xp, usr.level)}`);


        await usr.save();


    }

}

