/*
FILE: Token.model.js
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _id: String
});

module.exports = mongoose.model("Token", tokenSchema);
