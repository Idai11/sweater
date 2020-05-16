/*
FILE: plants.js
*/

const errors = require("./errors");
const data = require("../models/plant-data.js");

module.exports = resolvers => {
    resolvers.Query.plant = (root, {name}, req) => {
        // Id user is authed
        if (req.authUser) {
            // Return plant data for the name
            return data[name];
        } else {
            // Else throw unauthorized error
            throw errors.unauthorized();
        }
    }

    return resolvers;
}
