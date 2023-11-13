const { Schema, model } = require("mongoose");

const counterSchema = new Schema({
    count: {
        type: Number,
        required: true,
        default: 0
    }

});


module.exports = model("counterSchema", counterSchema);