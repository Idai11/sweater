const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const badgeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        unique: true
    },
    tooltip: {
        type: String,
        required: true,
        minLength: 1
    },
    path: {
        type: String,
        required: true,
        minLength: 1,
        match: [/^\/badges\/.+/, "Path is not in the badges directory"]
    }
});

module.exports = mongoose.model("Badge", badgeSchema);
