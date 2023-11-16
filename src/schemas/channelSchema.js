const { Schema, model } = require("mongoose");

const channelSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    cfsId: {
        type: String
    },
    rankId: {
        type: String
    },


}, { timestamps: true });


module.exports = model("channelSchema", channelSchema);