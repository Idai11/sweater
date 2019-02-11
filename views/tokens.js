const crypto = require("crypto");

const errors = require("./errors");
const tokenMaker = require("../misc/tokens");

const tokenModel = require("../models/Token.model");
const userModel = require("../models/User.model");

const tokens = (req, res) => {
    const method = req.method.toUpperCase();

    switch (method) {
        case "POST":
            tokensPost(req, res);
            break;
        case "DELETE":
            tokensDelete(req, res);
            break;
        default:
            errors.methodNotAllowed(req, res);
            break;
    }
}

const tokensPost = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userModel.findOne({"email": email}, (err, user) => {
        if (err) {
            errors.databaseError(req, res);
        } else {
            if (user) {
                givenPass = crypto.createHash("sha512").update(password + user.salt).digest("base64");
                if (givenPass === user.password) {
                    const tokenString = tokenMaker.make(user);

                    const newToken = new tokenModel({
                        _id: tokenString
                    })

                    newToken.save((err, token) => {
                        if (err) {
                            errors.databaseError(req, res);
                        } else {
                            res.json(token);
                        }
                    })
                } else {
                    errors.loginFailed(req, res);
                }
            } else {
                errors.loginFailed(req, res);
            }
        }
    });
}

const tokensDelete = (req, res) => {
    const token = typeof(req.headers.token) == "string" ? req.headers.token : false;
    const tokenData = tokenMaker.eval(token);

    if (token) {
        tokenModel.findOne({"_id": token}, (err, token) => {
            if (err) {
                errors.databaseError(req, res);
            } else {
                if (token) {
                    userModel.findOne({"_id": tokenData.sub}, (err, user) => {
                        if (err) {
                            errors.databaseError(req, res);
                        } else {
                            if (user) {
                                tokenModel.deleteOne({"_id": token}, err => {
                                    if (err) {
                                        errors.databaseError(req, res);
                                    } else {
                                        res.status(204);
                                        res.json();
                                    }
                                });
                            } else {
                                errors.loginFailed(req, res);
                            }
                        }
                    });
                } else {
                    errors.loginFailed(req, res);
                }
            }

        });
    } else {
        errors.loginFailed(req, res);
    }
}

module.exports = tokens;
