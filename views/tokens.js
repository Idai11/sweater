const crypto = require("crypto");

const errors = require("./errors");
const tokenMaker = require("../misc/tokens");
const validator = require("../misc/authValidator");

const tokenModel = require("../models/Token.model");
const userModel = require("../models/User.model");

const tokens = (req, res) => {
    const method = req.method.toUpperCase();

    switch (method) {
        case "GET":
            tokensGet(req, res);
            break;
        case "POST":
            tokensPost(req, res);
            break;
        case "OPTIONS":
            res.status(200);
            res.end();
            break;
        default:
            errors.methodNotAllowed(req, res);
            break;
    }
}

/*
Gets a list of all tokens
ADMIN REQUIRED
REQUIRES:
    nothing
RETURNS:
    a list of all the tokens
*/
const tokensGet = (req, res) => {
    if (req.authUser.admin) {
        tokenModel.find({}, (err, tokens) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                res.json(tokens);
            }
        })
    } else {
        errors.unauthorized(req, res);
    }
};

/*
Create a new auth token (log in)
REQUIRES:
    email
    password
RETURNS:
    the token object
*/
const tokensPost = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req);

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
                            token.admin = user.admin;
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

module.exports = tokens;
