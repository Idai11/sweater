const errors = require("../views/errors");
const tokenMaker = require("./tokens");

const tokenModel = require("../models/Token.model");
const userModel = require("../models/User.model");

const validate = (req, res, callback) => {
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
        errors.loginFailed(req, res);
    }
};

module.exports = validate;
