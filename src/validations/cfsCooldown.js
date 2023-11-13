const UserSchema = require("../Schemas/userSchema");

module.exports = async (interaction, commandObj, handler, client) => {
    if (commandObj.name === "confess") {


        let userProfile = await UserSchema.findOne({
            userId: interaction.member.id,
        });

        if (userProfile && (typeof userProfile.confessions !== 'undefined' && userProfile.confessions.length > 0)) {

            const lastConfDate = userProfile.confessions.pop().confDate;

            const currentDate = new Date();
            const delta = Math.floor(currentDate.getTime() - lastConfDate.getTime()) / 60000;

            if (delta <= 10) {
                interaction.reply({
                    content: `You can confess again in ${Math.ceil(10 - delta)} min.`,
                    ephemeral: true,
                });
                return true;
            }
        }

    }

};