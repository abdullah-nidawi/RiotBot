const { Schema, model } = require("mongoose");

const levelSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    guildId: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    }


}, { timestamps: true });


module.exports = model("levelSchema", levelSchema);