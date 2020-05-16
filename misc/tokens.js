/*
FILE: tokens.js
*/

/*
The server uses JSON Web Tokens to keep track of auth
A JWT cannot be forged without a secret key and contains a value
In this use the value is the ID of the user that the token belongs to
This way the user doesn't send their username and password every request

The token expires after 1 day
*/

// External package (see package.json)
const jwt = require("jsonwebtoken"); // Creating and validating JWTs
const config = require("./config");

const tokens = {};

/*
Generate an auth token for the given user using the secret key
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
