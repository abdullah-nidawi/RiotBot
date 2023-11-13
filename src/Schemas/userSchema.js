const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    confessions: [{
        confText: String,
        confDate: Date
    }],
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    lastXp: {
        type: Date
    }
    
    
}, {timestamps: true});


module.exports = model("userSchema", userSchema);