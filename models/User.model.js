const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        minLength: 1,
        match: /^.+@.+\..+$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        minLength: 24,
    },
    salt: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false
    },
    badges: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

module.exports = mongoose.model("User", userSchema);
