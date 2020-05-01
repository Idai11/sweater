/*
FILE: User.model.js
*/

const mongoose = require("mongoose");
const userSchema = require("./User.schema.js");

module.exports = mongoose.model("User", userSchema);
