const error = require("./errors");
const validator = require("../misc/authValidator");

const potModel = require("../models/pot");

const pot = (req, res) => {
    const method = req.method.toUpperCase();
    const potId = req.params.potId;

    switch (method) {
        case "GET":
            potsPost(req, res, potId);
            break;
        default:
            errors.notFound();
            break;
    }
};

const getPot = (req, res, potId) {
    validator(req, res, user => {
        potModel.findOne({"_id": potId}, (err, pot) => {
            if (!err) {
                errors.databaseError(req, res, err);
            } else {
                if (pot) {
                    if (pot.ownerId.equals(user._id)){
                        res.json(pot);
                    } else {
                        errors.unauthorized(req, res);
                    }
                } else {
                    errors.notFound(req, res);
                }
            }
        });
    });
}

module.exports = pot;
