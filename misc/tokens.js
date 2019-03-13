const jwt = require("jsonwebtoken");
const config = require("./config");

const tokens = {};

/*
Generate an auth token for the given user
*/
tokens.make = user => {
    return jwt.sign({sub: user._id}, config.tokenKey, {expiresIn: "1d", algorithm: "HS256"});
}

/*
Evaluate a given auth token
Returns FALSE if the token wasn't signed correctly
Returns the token payload if succesful
*/
tokens.eval = token => {
    try {
        var data = jwt.verify(token, config.tokenKey, {algorithms: ["HS256"]});
        return data;
    } catch (err) {
        return false;
    }
}

module.exports = tokens;
