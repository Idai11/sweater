const errors = require("./errors");

const userModel = require("../models/User.model");

const users = (req, res) => {
    const method = req.method.toUpperCase();

    switch (method) {
        case "GET":
            getUsers(req, res);
            break;
        case "POST":
            postUsers(req, res);
            break;
        default:
            errors.methodNotAllowed(req, res);
            break;
    }
};

const getUsers = (req, res) => {
    userModel.find({}, (err, users) => {
        if (err) {
            errors.databaseError(req, res);
        } else {
            res.json(users);
        }
    });
}

const postUsers = (req, res) => {
    res.send("POST!");
}

module.exports = users;
