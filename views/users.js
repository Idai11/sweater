const errors = require("./errors");
const stringers = require("../misc/stringers");
const config = require("../misc/config");
const crypto = require("crypto");

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
            errors.databaseError(req, res, err);
        } else {
            res.json(users.map(user => {
                user = user.toObject();
                delete user.password;
                delete user.salt;
                return user;
            }));
        }
    });
}

const postUsers = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const salt = stringers.generateRandomString(5);
    const password = typeof(req.body.password) == "string" && req.body.password.length > 0 ? crypto.createHash("sha512").update(req.body.password + salt).digest("base64") : "";

    var newUser = new userModel({
        firstName,
        lastName,
        email,
        password,
        salt
    });

    newUser.save((err, user) => {
        if (err) {
            if (typeof(err.errors) == "undefined") {
                errors.emailTaken(req, res);
            } else {
                errors.invalidArguments(req, res, Object.keys(err.errors));
            }
        } else {
            res.status(201);
            user = user.toObject();
            delete user.password;
            delete user.salt;
            res.json(user);
        }
    })
}

module.exports = users;
