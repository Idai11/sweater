const jwt = require("jsonwebtoken");
const config = require("./config");

const tokens = {};

tokens.make = user => {
    return jwt.sign({sub: user._id}, config.tokenKey, {expiresIn: "1d", algorithm: "HS256"});
}

tokens.eval = token => {
    try {
        var data = jwt.verify(token, config.tokenKey, {algorithms: ["HS256"]});
        return data;
    } catch (err) {
        return false;
    }
}

module.exports = tokens;
