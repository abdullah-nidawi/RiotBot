const UserSchema = require("../../schemas/userSchema");


module.exports = async (member) => {
    let usr = await UserSchema.findOne({
        userId: member.id,
    });

    if (usr) {
        return;
    }
    else {
        usr = new UserSchema({
            userName: member.user.username,
            userId: member.id,
            lastXp: new Date()
        });
        await usr.save();
    }
}