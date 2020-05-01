/*
FILE: Pot.model.js
*/

const mongoose = require("mongoose");
const userSchema = require("./User.schema.js");
const Schema = mongoose.Schema;

const potSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    imgUrl: {
        type: String,
        maxLength: 100
    },
    plant: {
        type: String,
        minLength: 1,
        maxLength: 100
    },
    plantDate: Date,
    lightHours: [Number],
    moisture: Number,
    waterLevel: Number,
    owner: {
        type: userSchema,
        required: true
    }
});

module.exports = mongoose.model("Pot", potSchema);
