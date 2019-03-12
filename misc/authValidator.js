const errors = require("../views/errors");
const tokenMaker = require("./tokens");

const tokenModel = require("../models/Token.model");
const userModel = require("../models/User.model");

/*
Validate the user from the request headers
Return a login failed error if problem is found
Callback with the authenticated user if succesful
*/
const validate = (req, res, callback) => {
    const token = typeof(req.headers.token) == "string" ? req.headers.token : false;
    const tokenData = tokenMaker.eval(token);

    if (token) {
        tokenModel.findOne({"_id": token}, (err, token) => {
            if (err) {
                errors.databaseError(req, res, err);
            } else {
                if (token) {
                    userModel.findOne({"_id": tokenData.sub}, (err, user) => {
                        if (err) {
                            errors.databaseError(req, res, err);
                        } else {
                            if (user) {
                                callback(user);
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
        callback({
            admin: false
        });
    }
};

module.exports = validate;
