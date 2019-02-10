const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String
    },
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
        match: /^.+@.+\..+$/
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
    }
});

module.exports = mongoose.model("User", userSchema);
