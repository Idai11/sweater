const objectId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");
const errors = require("./errors");
const validator = require("../misc/authValidator");

const userModel = require("../models/User.model");

const user = (req, res) => {
    const method = req.method.toUpperCase();
    const userId = req.params.userId;

    switch (method) {
        case "GET":
            userGet(req, res, userId);
            break;
        case "PUT":
            userPut(req, res, userId);
            break;
        default:
            errors.methodNotAllowed(req, res);
    }
}

const userGet = (req, res, userId) => {
    try {
        const userObjId = objectId(userId);
        userModel.findOne({"_id": userObjId}, (err, user) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                if (user) {
                    user = user.toObject();
                    delete user.password;
                    delete user.salt;
                    res.json(user);
                } else {
                    errors.notFound(req, res, "User");
                }
            }
        });
    } catch {
        errors.invalidArguments(req, res, ["userId"]);
    }
}

const userPut = (req, res, userId) => {
    try {
        const userObjId = objectId(userId);
        userModel.findOne({"_id": userObjId}, (err, user) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                if (user) {
                    validator(req, res, authUser => {
                        if (authUser._id.equals(user._id)) {
                            const firstName = req.body.firstName;
                            const lastName = req.body.lastName;
                            const email = req.body.email;
                            const oldPassword = typeof(req.body.oldPassword) == "string" && req.body.oldPassword.length > 0 ? crypto.createHash("sha512").update(req.body.oldPassword + authUser.salt).digest("base64") : false;
                            const password = typeof(req.body.password) == "string" && req.body.password.length > 0 ? crypto.createHash("sha512").update(req.body.password + authUser.salt).digest("base64") : false;

                            if (password) {
                                console.log(password);
                                if (oldPassword === authUser.password) {
                                    authUser.password = password;
                                } else {
                                    errors.invalidArguments(req, res, ["oldPassword"]);
                                    return;
                                }
                            }
                            if (firstName) authUser.firstName = firstName;
                            if (lastName) authUser.lastName = lastName;
                            if (email) authUser.email = email;

                            authUser.save((err, updated) => {
                                if (err) {
                                    if (typeof(err.errors) == "undefined") {
                                        errors.emailTaken(req, res);
                                    } else {
                                        errors.invalidArguments(req, res, Object.keys(err.errors));
                                    }
                                } else {
                                    updated = updated.toObject();
                                    // delete updated.password;
                                    // delete updated.salt;
                                    res.json(updated);
                                }
                            });
                        } else {
                            errors.unauthorized(req, res);
                        }
                    });
                } else {
                    errors.notFound(req, res, "User");
                }
            }
        });
    } catch {
        errors.invalidArguments(req, res, ["userId"]);
    }
}

module.exports = user;
