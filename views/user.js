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
        case "DELETE":
            userDelete(req, res, userId);
            break;
        default:
            errors.methodNotAllowed(req, res);
    }
}

/*
Get a user object
REQUIRES:
    id (url param)
RETURNS:
    user object
*/
const userGet = (req, res, userId) => {
    try {
        if (userId === "me") {
            if (req.authUser.email) {
                authUser = req.authUser.toObject();
                delete authUser.password;
                delete authUser.salt;
                res.json(authUser);
            } else {
                errors.unauthorized(req, res);
            }
        } else {
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
        }
    } catch {
        errors.invalidArguments(req, res, ["userId"]);
    }
}

/*
Updates the user
LOGIN REQUIRED!
REQUIRES (OPTIONAL):
    firstName
    lastName
    email
    oldPassword & password
RETURNS:
    updated user object
*/
const userPut = (req, res, userId) => {
    try {
        let userObjId = "";
        if (userId === "me") {
            userObjId = req.authUser._id;
        } else {
            userObjId = objectId(userId);
        }
        userModel.findOne({"_id": userObjId}, (err, user) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                if (user) {
                    if (req.authUser.email && (req.authUser._id.equals(user._id) || req.authUser.admin)) {
                        const firstName = req.body.firstName;
                        const lastName = req.body.lastName;
                        const email = req.body.email;
                        const oldPassword = typeof(req.body.oldPassword) == "string" && req.body.oldPassword.length > 0 ? crypto.createHash("sha512").update(req.body.oldPassword + authUser.salt).digest("base64") : false;
                        const password = typeof(req.body.password) == "string" && req.body.password.length > 0 ? crypto.createHash("sha512").update(req.body.password + req.authUser.salt).digest("base64") : false;

                        if (password) {
                            if (oldPassword === user.password) {
                                user.password = password;
                            } else {
                                errors.invalidArguments(req, res, ["oldPassword"]);
                                return;
                            }
                        }
                        if (firstName) user.firstName = firstName;
                        if (lastName) user.lastName = lastName;
                        if (email) user.email = email;

                        user.save((err, updated) => {
                            if (err) {
                                if (typeof(err.errors) == "undefined") {
                                    errors.emailTaken(req, res);
                                } else {
                                    errors.invalidArguments(req, res, Object.keys(err.errors));
                                }
                            } else {
                                updated = updated.toObject();
                                delete updated.password;
                                delete updated.salt;
                                res.json(updated);
                            }
                        });
                    } else {
                        errors.unauthorized(req, res);
                    }
                } else {
                    errors.notFound(req, res, "User");
                }
            }
        });
    } catch (err) {
        errors.invalidArguments(req, res, ["userId"]);
    }
}

/*
Deletes the user
LOGIN REQUIRED!
REQUIRES:
    nothing
RETURNS:
    nothing
*/
const userDelete = (req, res, userId) => {
    try {
        let userObjId = "";
        if (userId === "me") {
            userObjId = req.authUser._id;
        } else {
            userObjId = objectId(userId);
        }
        userModel.findOne({"_id": userObjId}, (err, user) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                if (user) {
                    if (req.authUser._id.equals(user._id) || req.authUser.admin) {
                        userModel.deleteOne({"_id": userObjId}, err => {
                            if (err) {
                                errors.databaseError(req, res, err);
                            } else {
                                res.status(204);
                                res.json();
                            }
                        });
                    } else {
                        errors.unauthorized(req, res);
                    }
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
