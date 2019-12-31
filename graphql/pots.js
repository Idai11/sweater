const errors = require("./errors");
const potModel = require("../models/Pot.model");
const fieldValidator = require("../misc/fieldValidator")

module.exports = resolvers => {
    resolvers.Query.pot = async (root, {id}, req) => {
        const pot = await potModel.findOne({_id: id}).exec();
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(pot.owner._id))) {
            return pot;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.my_pots = async (root, {count, offset}, req) => {
        if (req.authUser) {
            const pots = await potModel.find({owner: req.authUser}).exec();
            return pots;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Mutation.createPot = async (root, {name}, req) => {
        if (fieldValidator.stringValidator([name], {min_length: 1, max_length: 100})) {
            if (req.authUser) {
                const pot = new potModel({
                    name,
                    owner: req.authUser
                })

                return await pot.save();
            } else {
                throw errors.unauthorized();
            }
        } else {
            throw errors.missingArgs();
        }
    }

    resolvers.Mutation.addData = async (root, {id, moisture, light}, req) => {
        if (fieldValidator.intValidator([moisture, light])) {
            pot = await potModel.findOne({_id: id}).exec();
            if (pot && (req.authUser.admin || pot.owner._id.equals(req.authUser._id))) {
                pot.moisture = moisture;

                if (pot.lightHours.length >= 8) {
                    pot.lightHours.shift();
                }
                pot.lightHours.push(light);

                return await pot.save();
            }
        }
    }

    return resolvers
}
