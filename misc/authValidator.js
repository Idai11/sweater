/*
FILE: authValidator.js
*/

const tokenMaker = require("./tokens");

const errors = require("../graphql/errors");

const tokenModel = require("../models/Token.model");
const userModel = require("../models/User.model");

/*
Validate the user from the request headers
Return a login failed error if problem is found
Callback with the authenticated user if successful
*/
const validate = (req, res, callback) => {
    // Get the token from the request headers
    const token = typeof(req.headers.token) == "string" ? req.headers.token : false;

    // For testing, if the token is "letmein", admin access is granted
    if (req.headers.token == "letmein") {
        callback({
            "admin": true
        })
        return;
    }

    // tokenData will be false if token is not signed correctly or overdue (see tokens.js)
    const tokenData = tokenMaker.eval(token);

    // If token was passed, proceed to validate
    if (tokenData) {

        // Check if user has logged out (is token in DB?)
        tokenModel.findOne({"_id": token}, (err, token) => {
            if (err) {
                throw errors.authFail();
            } else {
                // If token was in DB and is signed correctly and not overdue
                if (token && tokenData) {
                    // Find the use which the token belongs to
                    userModel.findOne({"_id": tokenData.sub}, (err, user) => {
                        if (err) {
                            throw errors.authFail();
                        } else {
                            // If the user was found
                            if (user) {
                                // Callback the user
                                callback(user);
                            } else {
                                throw errors.authFail();
                            }
                        }
                    });
                } else {
                    throw errors.authFail();
                }
            }
        });
    // No token was passed, user is not authed but no authentication error was thrown
    } else {
        callback(false);
    }
};

module.exports = validate;
