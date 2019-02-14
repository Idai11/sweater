const crypto = require("crypto");

const errors = require("./errors");
const tokenMaker = require("../misc/tokens");
const validator = require("../misc/validator");

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
            errors.databaseError(req, res, err);
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
                            errors.databaseError(req, res, err);
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

    validator(req, res, user => {
        tokenModel.deleteOne({"_id": token}, err => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                res.status(204);
                res.json();
            }
        });
    });
}

module.exports = tokens;
