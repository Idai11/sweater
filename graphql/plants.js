const errors = require("./errors");
const data = require("../models/plant-data.js");

module.exports = resolvers => {
    resolvers.Query.plant = (root, {name}, req) => {
        if (req.authUser) {
            return data[name];
        } else {
            throw errors.unauthorized();
        }
    }

    return resolvers;
}
