/*
FILE: config.js
*/

const config = {
    hashKey: "Cg{0`)2s>(nDU/&.}|19oh<y", // The secret for hashing passwords
    tokenKey: "]h:ElLE_yP60BP%UK$^w<>:^", // The secret for signing auth tokens
    port: process.env.PORT, // The port the server runs on
    debug: true // Is the app running in debug?
};

module.exports = config;
