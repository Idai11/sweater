const error = require("./errors");

const potModel = require("../models/Pot.model");

const pots = (req, res) => {
    const method = req.method.toUpperCase();

    switch (method) {
        case "POST":
            potsPost(req, res);
            break;
        default:
            errors.notFound();
            break;
    }
};

module.exports = pots;
